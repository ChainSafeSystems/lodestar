import {expect} from "chai";
import sinon from "sinon";

import {GENESIS_EPOCH} from "@chainsafe/lodestar-params";
import * as utils from "../../../../../src/util";
import {processRewardsAndPenalties} from "../../../../../src/naive/phase0/epoch/balanceUpdates";
import * as attestationDeltas from "../../../../../src/naive/phase0/epoch/balanceUpdates/attestation";
import {generateValidator} from "../../../../utils/validator";
import {generateState} from "../../../../utils/state";
import {SinonStubFn} from "../../../../utils/types";

describe("process epoch - balance updates", function () {
  const sandbox = sinon.createSandbox();
  let getCurrentEpochStub: SinonStubFn<typeof utils["getCurrentEpoch"]>,
    getAttestationDeltasStub: SinonStubFn<typeof attestationDeltas["getAttestationDeltas"]>,
    increaseBalanceStub: SinonStubFn<typeof utils["increaseBalance"]>,
    decreaseBalanceStub: SinonStubFn<typeof utils["decreaseBalance"]>;

  beforeEach(() => {
    getCurrentEpochStub = sandbox.stub(utils, "getCurrentEpoch");
    increaseBalanceStub = sandbox.stub(utils, "increaseBalance");
    decreaseBalanceStub = sandbox.stub(utils, "decreaseBalance");
    getAttestationDeltasStub = sandbox.stub(attestationDeltas, "getAttestationDeltas");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should process rewards and penalties - genesis epoch", function () {
    const state = generateState();
    getCurrentEpochStub.returns(GENESIS_EPOCH);

    processRewardsAndPenalties(state);
    expect(getAttestationDeltasStub.called).to.be.false;
  });

  it("should process rewards and penalties", function () {
    const state = generateState();
    const reward = BigInt(10);
    const penalty = BigInt(0);
    state.validators.push(generateValidator());
    getCurrentEpochStub.returns(10);
    getAttestationDeltasStub.returns([[reward], [penalty]]);

    processRewardsAndPenalties(state);
    expect(increaseBalanceStub.calledOnceWith(state, 0, reward + reward));
    expect(decreaseBalanceStub.calledOnceWith(state, 0, penalty + penalty));
  });
});
