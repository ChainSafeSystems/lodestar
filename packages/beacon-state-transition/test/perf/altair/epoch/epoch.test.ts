import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {allForks, altair} from "../../../../src";
import {generatePerfTestCachedStateAltair, perfStateId} from "../../util";

describe("Altair epoch transition steps", () => {
  setBenchOpts({
    maxMs: 60 * 1000,
    minMs: 15 * 1000,
    runs: 64,
  });

  const originalState = generatePerfTestCachedStateAltair({goBackOneSlot: true});
  const process = allForks.prepareEpochProcessState(originalState);

  const idPrefix = `epoch altair - ${perfStateId}`;

  itBench({
    id: `${idPrefix} - processJustificationAndFinalization`,
    beforeEach: () => originalState.clone() as allForks.CachedBeaconState<allForks.BeaconState>,
    fn: (state) => altair.processJustificationAndFinalization(state, process),
  });

  // As of Jun 18
  // Altair epoch transition steps
  // ================================================================
  // processInactivityUpdates                                              0.6118570 ops/s      1.634369  s/op     36 runs    60.48 s
  itBench({
    id: `${idPrefix} - processInactivityUpdates`,
    beforeEach: () => originalState.clone(),
    fn: (state) => altair.processInactivityUpdates(state, process),
  });

  itBench({
    id: `${idPrefix} - processRewardsAndPenalties`,
    beforeEach: () => originalState.clone(),
    fn: (state) => altair.processRewardsAndPenalties(state, process),
  });

  itBench({
    id: `${idPrefix} - processRegistryUpdates`,
    beforeEach: () => originalState.clone() as allForks.CachedBeaconState<allForks.BeaconState>,
    fn: (state) => altair.processRegistryUpdates(state, process),
  });

  itBench({
    id: `${idPrefix} - processSlashings`,
    beforeEach: () => originalState.clone(),
    fn: (state) => altair.processSlashings(state, process),
  });

  itBench({
    id: `${idPrefix} - processEth1DataReset`,
    beforeEach: () => originalState.clone() as allForks.CachedBeaconState<allForks.BeaconState>,
    fn: (state) => allForks.processEth1DataReset(state, process),
  });

  itBench({
    id: `${idPrefix} - processEffectiveBalanceUpdates`,
    beforeEach: () => originalState.clone() as allForks.CachedBeaconState<allForks.BeaconState>,
    fn: (state) => allForks.processEffectiveBalanceUpdates(state, process),
  });

  itBench({
    id: `${idPrefix} - processSlashingsReset`,
    beforeEach: () => originalState.clone() as allForks.CachedBeaconState<allForks.BeaconState>,
    fn: (state) => allForks.processSlashingsReset(state, process),
  });

  itBench({
    id: `${idPrefix} - processRandaoMixesReset`,
    beforeEach: () => originalState.clone() as allForks.CachedBeaconState<allForks.BeaconState>,
    fn: (state) => allForks.processRandaoMixesReset(state, process),
  });

  itBench({
    id: `${idPrefix} - processHistoricalRootsUpdate`,
    beforeEach: () => originalState.clone() as allForks.CachedBeaconState<allForks.BeaconState>,
    fn: (state) => allForks.processHistoricalRootsUpdate(state, process),
  });

  itBench({
    id: `${idPrefix} - processParticipationFlagUpdates`,
    beforeEach: () => originalState.clone(),
    fn: (state) => altair.processParticipationFlagUpdates(state),
  });

  itBench({
    id: `${idPrefix} - processSyncCommitteeUpdates`,
    beforeEach: () => originalState.clone(),
    fn: (state) => altair.processSyncCommitteeUpdates(state, process),
  });

  // do prepareEpochProcessState last
  itBench({
    id: `${idPrefix} - prepareEpochProcessState`,
    beforeEach: () => originalState.clone() as allForks.CachedBeaconState<allForks.BeaconState>,
    fn: (state) => void allForks.prepareEpochProcessState(state),
  });
});
