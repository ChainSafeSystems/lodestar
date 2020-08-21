/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Epoch, Gwei, Slot} from "@chainsafe/lodestar-types";

/**
 * HexRoot is a root as a hex string
 * Used for lightweight and easy comparison
 */
export type HexRoot = string;
export const HEX_ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

export interface IVoteTracker {
  currentRoot: HexRoot;
  nextRoot: HexRoot;
  nextEpoch: Epoch;
}

/**
 * A block that is to be applied to the fork choice
 *
 * A simplified version of BeaconBlock
 */
export interface IProtoBlock {
  slot: Slot;
  blockRoot: HexRoot;
  parentRoot?: HexRoot;
  stateRoot: HexRoot;
  targetRoot: HexRoot;
  justifiedEpoch: Epoch;
  finalizedEpoch: Epoch;
}

/**
 * A block root with additional metadata required to form a DAG
 * with vote weights and best blocks stored as metadata
 */
export interface IProtoNode {
  /**
   * The slot is not necessary for ProtoArray,
   * it just exists so external components can easily query the block slot.
   * This is useful for upstream fork choice logic.
   */
  slot: Slot;
  /**
   * The stateRoot is not necessary for ProtoArray either,
   * it also just exists for upstream components (namely attestation verification)
   */
  stateRoot: HexRoot;
  /**
   * The root that would be used for the attestation.data.target.root if a LMD vote was cast for this block.
   *
   * The targetRoot is not necessary for ProtoArray either,
   * it also just exists for upstream components (namely attestation verification)
   */
  targetRoot: HexRoot;

  blockRoot: HexRoot;

  parent?: number;
  justifiedEpoch: Epoch;
  finalizedEpoch: Epoch;

  weight: Gwei;
  bestChild?: number;
  bestDescendant?: number;
}
