import {EPOCHS_PER_SLASHINGS_VECTOR} from "@chainsafe/lodestar-params";
import {allForks} from "@chainsafe/lodestar-types";
import {IEpochProcess, CachedBeaconState} from "../util";

export function processSlashingsReset(state: CachedBeaconState<allForks.BeaconState>, process: IEpochProcess): void {
  const nextEpoch = process.currentEpoch + 1;

  // reset slashings
  state.slashings[nextEpoch % EPOCHS_PER_SLASHINGS_VECTOR] = BigInt(0);
}
