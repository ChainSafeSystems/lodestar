import {AbortController} from "abort-controller";
import {toBufferBE} from "bigint-buffer";
import {expect} from "chai";
import sinon from "sinon";
import bls from "@chainsafe/bls";
import {config} from "@chainsafe/lodestar-config/mainnet";
import {phase0} from "@chainsafe/lodestar-types";
import {toHexString} from "@chainsafe/ssz";
import {AttestationDutiesService} from "../../../src/services/attestationDuties";
import {ValidatorStore} from "../../../src/services/validatorStore";
import {ApiClientStub} from "../../utils/apiStub";
import {testLogger} from "../../utils/logger";
import {ClockMock} from "../../utils/clock";

describe("AttestationDutiesService", function () {
  const sandbox = sinon.createSandbox();
  const logger = testLogger();
  const ZERO_HASH = Buffer.alloc(32, 0);

  const apiClient = ApiClientStub(sandbox);
  const validatorStore = sinon.createStubInstance(ValidatorStore) as ValidatorStore &
    sinon.SinonStubbedInstance<ValidatorStore>;
  let pubkeys: Uint8Array[]; // Initialize pubkeys in before() so bls is already initialized

  // Sample validator
  const defaultValidator = config.types.phase0.ValidatorResponse.defaultValue();
  const index = 0;

  before(() => {
    const secretKeys = [bls.SecretKey.fromBytes(toBufferBE(BigInt(98), 32))];
    pubkeys = secretKeys.map((sk) => sk.toPublicKey().toBytes());
    validatorStore.votingPubkeys.returns(pubkeys);
    validatorStore.hasVotingPubkey.returns(true);
    validatorStore.signSelectionProof.resolves(ZERO_HASH);
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
    apiClient.beacon.state.getStateValidators.resolves([validatorResponse]);

    // Reply with some duties
    const slot = 1;
    const duty: phase0.AttesterDuty = {
      slot: slot,
      committeeIndex: 1,
      committeeLength: 120,
      committeesAtSlot: 120,
      validatorCommitteeIndex: 1,
      validatorIndex: index,
      pubkey: pubkeys[0],
    };
    apiClient.validator.getAttesterDuties.resolves({dependentRoot: ZERO_HASH, data: [duty]});

    // Accept all subscriptions
    apiClient.validator.prepareBeaconCommitteeSubnet.resolves();

    // Clock will call runAttesterDutiesTasks() immediatelly
    const clock = new ClockMock();
    const dutiesService = new AttestationDutiesService(config, logger, apiClient, clock, validatorStore);

    // Trigger clock onSlot for slot 0
    await clock.tickEpochFns(0, controller.signal);

    // Validator index should be persisted
    expect(Object.fromEntries(dutiesService["indices"])).to.deep.equal(
      {[toHexString(pubkeys[0])]: index},
      "Wrong dutiesService.indices Map"
    );

    // Duties for this and next epoch should be persisted
    expect(Object.fromEntries(dutiesService["attesters"].get(toHexString(pubkeys[0])) || new Map())).to.deep.equal(
      {
        // Since the ZERO_HASH won't pass the isAggregator test, selectionProof is null
        0: {dependentRoot: ZERO_HASH, dutyAndProof: {duty, selectionProof: null}},
        1: {dependentRoot: ZERO_HASH, dutyAndProof: {duty, selectionProof: null}},
      },
      "Wrong dutiesService.attesters Map"
    );

    expect(dutiesService.getAttestersAtSlot(slot)).to.deep.equal(
      [{duty, selectionProof: null}],
      "Wrong getAttestersAtSlot()"
    );

    expect(apiClient.validator.prepareBeaconCommitteeSubnet.callCount).to.equal(
      1,
      "prepareBeaconCommitteeSubnet() must be called once after getting the duties"
    );
  });
});
