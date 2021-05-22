import {routes} from "@chainsafe/lodestar-api";
import {Api as IBeaconBlocksApi} from "@chainsafe/lodestar-api/lib/routes/beacon/block";
import {fromHexString} from "@chainsafe/ssz";
import {ApiModules} from "../../types";
import {resolveBlockId, toBeaconHeaderResponse} from "./utils";

export function getBeaconBlockApi({
  chain,
  config,
  network,
  db,
}: Pick<ApiModules, "chain" | "config" | "network" | "db">): IBeaconBlocksApi {
  return {
    async getBlockHeaders(filters) {
      const result: routes.beacon.BlockHeaderResponse[] = [];
      if (filters.parentRoot) {
        const parentRoot = fromHexString(filters.parentRoot);
        const finalizedBlock = await db.blockArchive.getByParentRoot(parentRoot);
        if (finalizedBlock) {
          result.push(toBeaconHeaderResponse(config, finalizedBlock, true));
        }
        const nonFinalizedBlockSummaries = chain.forkChoice.getBlockSummariesByParentRoot(parentRoot);
        await Promise.all(
          nonFinalizedBlockSummaries.map(async (summary) => {
            const block = await db.block.get(summary.blockRoot);
            if (block) {
              const cannonical = chain.forkChoice.getCanonicalBlockSummaryAtSlot(block.message.slot);
              if (cannonical) {
                result.push(
                  toBeaconHeaderResponse(
                    config,
                    block,
                    config.types.Root.equals(cannonical.blockRoot, summary.blockRoot)
                  )
                );
              }
            }
          })
        );
        return {
          data: result.filter(
            (item) =>
              // skip if no slot filter
              !(filters.slot && filters.slot !== 0) || item.header.message.slot === filters.slot
          ),
        };
      }

      const headSlot = chain.forkChoice.getHead().slot;
      if (!filters.parentRoot && !filters.slot && filters.slot !== 0) {
        filters.slot = headSlot;
      }

      if (filters.slot !== undefined) {
        // future slot
        if (filters.slot > headSlot) {
          return {data: []};
        }

        const canonicalBlock = await chain.getCanonicalBlockAtSlot(filters.slot);
        // skip slot
        if (!canonicalBlock) {
          return {data: []};
        }
        const canonicalRoot = config
          .getForkTypes(canonicalBlock.message.slot)
          .BeaconBlock.hashTreeRoot(canonicalBlock.message);
        result.push(toBeaconHeaderResponse(config, canonicalBlock, true));

        // fork blocks
        await Promise.all(
          chain.forkChoice.getBlockSummariesAtSlot(filters.slot).map(async (summary) => {
            if (!config.types.Root.equals(summary.blockRoot, canonicalRoot)) {
              const block = await db.block.get(summary.blockRoot);
              if (block) {
                result.push(toBeaconHeaderResponse(config, block));
              }
            }
          })
        );
      }

      return {data: result};
    },

    async getBlockHeader(blockId) {
      const block = await resolveBlockId(chain.forkChoice, db, blockId);
      return {data: toBeaconHeaderResponse(config, block, true)};
    },

    async getBlock(blockId) {
      return {data: await resolveBlockId(chain.forkChoice, db, blockId)};
    },

    async getBlockV2(blockId) {
      const block = await resolveBlockId(chain.forkChoice, db, blockId);
      return {data: block, version: config.getForkName(block.message.slot)};
    },

    async getBlockAttestations(blockId) {
      const block = await resolveBlockId(chain.forkChoice, db, blockId);
      return {data: Array.from(block.message.body.attestations)};
    },

    async getBlockRoot(blockId) {
      // Fast path: From head state already available in memory get historical blockRoot
      const slot = parseInt(blockId);
      if (!Number.isNaN(slot)) {
        const head = chain.forkChoice.getHead();

        if (slot === head.slot) {
          return {data: head.blockRoot};
        }

        if (slot < head.slot && head.slot <= slot + config.params.SLOTS_PER_HISTORICAL_ROOT) {
          const state = chain.getHeadState();
          return {data: state.blockRoots[slot % config.params.SLOTS_PER_HISTORICAL_ROOT]};
        }
      }

      // Slow path
      const block = await resolveBlockId(chain.forkChoice, db, blockId);
      return {data: config.getForkTypes(block.message.slot).BeaconBlock.hashTreeRoot(block.message)};
    },

    async publishBlock(signedBlock) {
      await Promise.all([chain.receiveBlock(signedBlock), network.gossip.publishBeaconBlock(signedBlock)]);
    },
  };
}
