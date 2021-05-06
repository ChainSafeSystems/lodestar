import {computeEpochAtSlot} from "@chainsafe/lodestar-beacon-state-transition";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {altair, BLSPubkey, Epoch, Root, Slot} from "@chainsafe/lodestar-types";
import {BeaconBlockHeader} from "@chainsafe/lodestar-types/phase0";
import {ArrayLike, BitVector} from "@chainsafe/ssz";

export function sumBits(bits: ArrayLike<boolean>): number {
  let sum = 0;
  for (const bit of bits) {
    if (bit) {
      sum++;
    }
  }
  return sum;
}

export function isZeroHash(root: Root): boolean {
  for (let i = 0; i < root.length; i++) {
    if (root[i] !== 0) {
      return false;
    }
  }
  return true;
}

export function assertZeroHashes(rootArray: ArrayLike<Root>, expectedLength: number, errorMessage: string): void {
  if (rootArray.length !== expectedLength) {
    throw Error(`Wrong length ${errorMessage}`);
  }

  for (const root of rootArray) {
    if (!isZeroHash(root)) {
      throw Error(`Not zeroed ${errorMessage}`);
    }
  }
}

/**
 * Util to guarantee that all bits have a corresponding pubkey
 */
export function getParticipantPubkeys(pubkeys: ArrayLike<BLSPubkey>, bits: BitVector): BLSPubkey[] {
  const participantPubkeys: BLSPubkey[] = [];
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      if (!pubkeys[i]) throw Error(`No pubkey ${i} in syncCommittee`);
      participantPubkeys.push(pubkeys[i]);
    }
  }

  return participantPubkeys;
}

export function computePeriodAtSlot(config: IBeaconConfig, slot: Slot): number {
  return computePeriodAtEpoch(config, computeEpochAtSlot(config, slot));
}

export function computePeriodAtEpoch(config: IBeaconConfig, epoch: Epoch): number {
  return Math.floor(epoch / config.params.EPOCHS_PER_SYNC_COMMITTEE_PERIOD);
}

export function toBlockHeader(config: IBeaconConfig, block: altair.BeaconBlock): BeaconBlockHeader {
  return {
    slot: block.slot,
    proposerIndex: block.proposerIndex,
    parentRoot: block.parentRoot,
    stateRoot: block.stateRoot,
    bodyRoot: config.types.altair.BeaconBlockBody.hashTreeRoot(block.body),
  };
}
