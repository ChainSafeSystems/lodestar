/* eslint-disable @typescript-eslint/naming-convention */
import {fromHexString} from "@chainsafe/ssz";
import {PresetName} from "@chainsafe/lodestar-params";
import {IChainConfig} from "../chainConfig";
import {createIBeaconConfig} from "../index";

export const chainConfig: IChainConfig = {
  PRESET_BASE: PresetName.mainnet,
  // Genesis
  // ---------------------------------------------------------------
  // `2**14` (= 16,384)
  MIN_GENESIS_ACTIVE_VALIDATOR_COUNT: 16384,
  // Dec 1, 2020, 12pm UTC
  MIN_GENESIS_TIME: 1606824000,
  // Mainnet initial fork version, recommend altering for testnets
  GENESIS_FORK_VERSION: fromHexString("0x00000000"),
  // 604800 seconds (7 days)
  GENESIS_DELAY: 604800,

  // Forking
  // ---------------------------------------------------------------
  // Some forks are disabled for now:
  //  - These may be re-assigned to another fork-version later
  //  - Temporarily set to max uint64 value: 2**64 - 1

  // Altair
  ALTAIR_FORK_VERSION: fromHexString("0x01000000"),
  ALTAIR_FORK_EPOCH: Infinity,
  // Merge
  MERGE_FORK_VERSION: fromHexString("0x02000000"),
  MERGE_FORK_EPOCH: Infinity,
  // Sharding
  SHARDING_FORK_VERSION: fromHexString("0x03000000"),
  SHARDING_FORK_EPOCH: Infinity,

  // TBD, 2**32 is a placeholder. Merge transition approach is in active R&D.
  TRANSITION_TOTAL_DIFFICULTY: 4294967296,

  // Time parameters
  // ---------------------------------------------------------------
  // 12 seconds
  SECONDS_PER_SLOT: 12,
  // 14 (estimate from Eth1 mainnet)
  SECONDS_PER_ETH1_BLOCK: 14,
  // 2**8 (= 256) epochs ~27 hours
  MIN_VALIDATOR_WITHDRAWABILITY_DELAY: 256,
  // 2**8 (= 256) epochs ~27 hours
  SHARD_COMMITTEE_PERIOD: 256,
  // 2**11 (= 2,048) Eth1 blocks ~8 hours
  ETH1_FOLLOW_DISTANCE: 2048,

  // Validator cycle
  // ---------------------------------------------------------------
  // 2**2 (= 4)
  INACTIVITY_SCORE_BIAS: BigInt(4),
  // 2**4 (= 16)
  INACTIVITY_SCORE_RECOVERY_RATE: 16,
  // 2**4 * 10**9 (= 16,000,000,000) Gwei
  EJECTION_BALANCE: 16000000000,
  // 2**2 (= 4)
  MIN_PER_EPOCH_CHURN_LIMIT: 4,
  // 2**16 (= 65,536)
  CHURN_LIMIT_QUOTIENT: 65536,

  // Deposit contract
  // ---------------------------------------------------------------
  // Ethereum PoW Mainnet
  DEPOSIT_CHAIN_ID: 1,
  DEPOSIT_NETWORK_ID: 1,
  DEPOSIT_CONTRACT_ADDRESS: fromHexString("0x00000000219ab540356cBB839Cbe05303d7705Fa"),
};

export const config = createIBeaconConfig(chainConfig);
