import {expect} from "chai";
import sinon from "sinon";

import {config} from "@chainsafe/lodestar-config/mainnet";
import {GENESIS_SLOT, SLOTS_PER_EPOCH} from "@chainsafe/lodestar-params";
import {processEpoch} from "../../../../src/naive/phase0/epoch";
import * as justificationUtils from "../../../../src/naive/phase0/epoch/justification";
import * as balanceUpdateUtils from "../../../../src/naive/phase0/epoch/balanceUpdates";
import * as registryUpdateUtils from "../../../../src/naive/phase0/epoch/registryUpdates";
import * as slashingUtils from "../../../../src/naive/phase0/epoch/slashings";
import {generateState} from "../../../utils/state";
import {SinonStubFn} from "../../../utils/types";

/* eslint-disable no-empty */

describe("process epoch - crosslinks", function () {
  const sandbox = sinon.createSandbox();

  let processJustificationAndFinalizationStub: SinonStubFn<
      typeof justificationUtils["processJustificationAndFinalization"]
    >,
    processRewardsAndPenaltiesStub: SinonStubFn<typeof balanceUpdateUtils["processRewardsAndPenalties"]>,
    processRegistryUpdatesStub: SinonStubFn<typeof registryUpdateUtils["processRegistryUpdates"]>,
    processSlashingsStub: SinonStubFn<typeof slashingUtils["processSlashings"]>;

  beforeEach(() => {
    processJustificationAndFinalizationStub = sandbox.stub(justificationUtils, "processJustificationAndFinalization");
    processRewardsAndPenaltiesStub = sandbox.stub(balanceUpdateUtils, "processRewardsAndPenalties");
    processRegistryUpdatesStub = sandbox.stub(registryUpdateUtils, "processRegistryUpdates");
    processSlashingsStub = sandbox.stub(slashingUtils, "processSlashings");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should fail to process - genesis slot", function () {
    try {
      processEpoch(config, generateState({slot: GENESIS_SLOT}));
      expect.fail();
    } catch (e) {}
  });

  it("should fail to process - not epoch", function () {
    try {
      processEpoch(config, generateState({slot: 1}));
      expect.fail();
    } catch (e) {}
  });

  it("should process epoch", function () {
    processEpoch(config, generateState({slot: SLOTS_PER_EPOCH - 1}));
    expect(processJustificationAndFinalizationStub.calledOnce).to.be.true;
    expect(processRewardsAndPenaltiesStub.calledOnce).to.be.true;
    expect(processRegistryUpdatesStub.calledOnce).to.be.true;
    expect(processSlashingsStub.calledOnce).to.be.true;
  });
});
