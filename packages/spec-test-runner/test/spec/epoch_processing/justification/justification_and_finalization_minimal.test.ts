import {join} from "path";
import {expect} from "chai";

import {config} from "@chainsafe/lodestar-config/minimal";
import {processJustificationAndFinalization} from "@chainsafe/lodestar-beacon-state-transition";
import {BeaconState} from "@chainsafe/lodestar-types";
import {describeDirectorySpecTest, InputType} from "@chainsafe/lodestar-spec-test-util/lib/single";
import {IStateTestCase} from "../../../utils/specTestTypes/stateTestCase";
import {SPEC_TEST_LOCATION} from "../../../utils/specTestCases";

describeDirectorySpecTest<IStateTestCase, BeaconState>(
  "epoch justification and finalization minimal",
  join(SPEC_TEST_LOCATION, "/tests/minimal/phase0/epoch_processing/justification_and_finalization/pyspec_tests"),
  (testcase) => {
    const state = testcase.pre;
    processJustificationAndFinalization(config, state);
    return state;
  },
  {
    inputTypes: {
      pre: InputType.SSZ,
      post: InputType.SSZ,
    },
    sszTypes: {
      pre: config.types.BeaconState,
      post: config.types.BeaconState,
    },
    getExpected: (testCase) => testCase.post,
    expectFunc: (testCase, expected, actual) => {
      expect(config.types.BeaconState.equals(actual, expected)).to.be.true;
    },
  }
);