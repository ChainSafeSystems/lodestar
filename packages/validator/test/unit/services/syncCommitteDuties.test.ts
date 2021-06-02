import {AbortController} from "abort-controller";
import {toBufferBE} from "bigint-buffer";
import {expect} from "chai";
import sinon from "sinon";
import bls from "@chainsafe/bls";
import {createIBeaconConfig} from "@chainsafe/lodestar-config";
import {config as mainnetConfig} from "@chainsafe/lodestar-config/mainnet";
import {toHexString} from "@chainsafe/ssz";
import {routes} from "@chainsafe/lodestar-api";
import {SyncCommitteeDutiesService} from "../../../src/services/syncCommitteeDuties";
import {ValidatorStore} from "../../../src/services/validatorStore";
import {getApiClientStub} from "../../utils/apiStub";
import {testLogger} from "../../utils/logger";
import {ClockMock} from "../../utils/clock";
import {IndicesService} from "../../../src/services/indices";
import {ssz} from "@chainsafe/lodestar-types";

/* eslint-disable @typescript-eslint/naming-convention */

describe("SyncCommitteeDutiesService", function () {
  const sandbox = sinon.createSandbox();
  const logger = testLogger();
  const ZERO_HASH = Buffer.alloc(32, 0);

  const api = getApiClientStub(sandbox);
  const validatorStore = sinon.createStubInstance(ValidatorStore) as ValidatorStore &
    sinon.SinonStubbedInstance<ValidatorStore>;
  let pubkeys: Uint8Array[]; // Initialize pubkeys in before() so bls is already initialized

  const config = createIBeaconConfig({
    ...mainnetConfig,
    ALTAIR_FORK_EPOCH: 0, // Activate Altair immediatelly
  });

  const index = 4;
  // Sample validator
  const defaultValidator: routes.beacon.ValidatorResponse = {
    index,
    balance: BigInt(32e9),
    status: "active",
    validator: ssz.phase0.Validator.defaultValue(),
  };

  before(() => {
    const secretKeys = [bls.SecretKey.fromBytes(toBufferBE(BigInt(98), 32))];
    pubkeys = secretKeys.map((sk) => sk.toPublicKey().toBytes());
    validatorStore.votingPubkeys.returns(pubkeys);
    validatorStore.hasVotingPubkey.returns(true);
    validatorStore.signAttestationSelectionProof.resolves(ZERO_HASH);
    validatorStore.signSyncCommitteeSelectionProof.resolves(ZERO_HASH);
  });

  let controller: AbortController; // To stop clock
  beforeEach(() => (controller = new AbortController()));
  afterEach(() => controller.abort());

  it("Should fetch indexes and duties", async function () {
    // Reply with an active validator that has an index
    const validatorResponse = {
      ...defaultValidator,
      index,
      validator: {...defaultValidator.validator, pubkey: pubkeys[0]},
    };
    api.beacon.getStateValidators.resolves({data: [validatorResponse]});

    // Reply with some duties
    const slot = 1;
    const duty: routes.validator.SyncDuty = {
      pubkey: pubkeys[0],
      validatorIndex: index,
      validatorSyncCommitteeIndices: [7],
    };
    api.validator.getSyncCommitteeDuties.resolves({dependentRoot: ZERO_HASH, data: [duty]});

    // Accept all subscriptions
    api.validator.prepareSyncCommitteeSubnets.resolves();

    // Clock will call runAttesterDutiesTasks() immediatelly
    const clock = new ClockMock();
    const indicesService = new IndicesService(logger, api, validatorStore);
    const dutiesService = new SyncCommitteeDutiesService(config, logger, api, clock, validatorStore, indicesService);

    // Trigger clock onSlot for slot 0
    await clock.tickEpochFns(0, controller.signal);

    // Validator index should be persisted
    expect(Object.fromEntries(indicesService["pubkey2index"])).to.deep.equal(
      {[toHexString(pubkeys[0])]: index},
      "Wrong dutiesService.indices Map"
    );

    // Duties for this and next epoch should be persisted
    expect(Object.fromEntries(dutiesService["dutiesByPeriodByIndex"].get(index) || new Map())).to.deep.equal(
      {
        0: {dependentRoot: ZERO_HASH, duty},
        1: {dependentRoot: ZERO_HASH, duty},
      },
      "Wrong dutiesService.attesters Map"
    );

    expect(await dutiesService.getDutiesAtSlot(slot)).to.deep.equal(
      [
        {
          duty: {
            pubkey: duty.pubkey,
            validatorIndex: duty.validatorIndex,
            validatorSyncCommitteeIndex: duty.validatorSyncCommitteeIndices[0],
          },
          selectionProof: null,
          subCommitteeIndex: 0,
        },
      ],
      "Wrong getAttestersAtSlot()"
    );

    expect(api.validator.prepareSyncCommitteeSubnets.callCount).to.equal(
      1,
      "prepareSyncCommitteeSubnets() must be called once after getting the duties"
    );
  });
});
