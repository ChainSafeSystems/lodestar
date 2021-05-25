import {ForkName} from "@chainsafe/lodestar-config";
import {config} from "@chainsafe/lodestar-config/minimal";
import {toHexString} from "@chainsafe/ssz";
import {Api, ReqTypes, BlockHeaderResponse, ValidatorResponse} from "../../src/routes/beacon";
import {getClient} from "../../src/client/beacon";
import {getRoutes} from "../../src/server/beacon";
import {runGenericServerTest} from "../utils/genericServerTest";

describe("beacon", () => {
  const root = Buffer.alloc(32, 1);
  const balance = BigInt(32e9);

  const blockHeaderResponse: BlockHeaderResponse = {
    root,
    canonical: true,
    header: config.types.phase0.SignedBeaconBlockHeader.defaultValue(),
  };

  const validatorResponse: ValidatorResponse = {
    index: 1,
    balance,
    status: "active_ongoing",
    validator: config.types.phase0.Validator.defaultValue(),
  };

  runGenericServerTest<Api, ReqTypes>(config, getClient, getRoutes, {
    // block

    getBlock: {
      args: ["head"],
      res: {data: config.types.phase0.SignedBeaconBlock.defaultValue()},
    },
    getBlockV2: {
      args: ["head"],
      res: {data: config.types.altair.SignedBeaconBlock.defaultValue(), version: ForkName.altair},
    },
    getBlockAttestations: {
      args: ["head"],
      res: {data: [config.types.phase0.Attestation.defaultValue()]},
    },
    getBlockHeader: {
      args: ["head"],
      res: {data: blockHeaderResponse},
    },
    getBlockHeaders: {
      args: [{slot: 1, parentRoot: toHexString(root)}],
      res: {data: [blockHeaderResponse]},
    },
    getBlockRoot: {
      args: ["head"],
      res: {data: root},
    },
    publishBlock: {
      args: [config.types.phase0.SignedBeaconBlock.defaultValue()],
      res: undefined,
    },

    // pool

    getPoolAttestations: {
      args: [{slot: 1, committeeIndex: 2}],
      res: {data: [config.types.phase0.Attestation.defaultValue()]},
    },
    getPoolAttesterSlashings: {
      args: [],
      res: {data: [config.types.phase0.AttesterSlashing.defaultValue()]},
    },
    getPoolProposerSlashings: {
      args: [],
      res: {data: [config.types.phase0.ProposerSlashing.defaultValue()]},
    },
    getPoolVoluntaryExits: {
      args: [],
      res: {data: [config.types.phase0.SignedVoluntaryExit.defaultValue()]},
    },
    submitPoolAttestations: {
      args: [[config.types.phase0.Attestation.defaultValue()]],
      res: undefined,
    },
    submitPoolAttesterSlashing: {
      args: [config.types.phase0.AttesterSlashing.defaultValue()],
      res: undefined,
    },
    submitPoolProposerSlashing: {
      args: [config.types.phase0.ProposerSlashing.defaultValue()],
      res: undefined,
    },
    submitPoolVoluntaryExit: {
      args: [config.types.phase0.SignedVoluntaryExit.defaultValue()],
      res: undefined,
    },
    submitPoolSyncCommitteeSignatures: {
      args: [[config.types.altair.SyncCommitteeSignature.defaultValue()]],
      res: undefined,
    },

    // state

    getStateRoot: {
      args: ["head"],
      res: {data: root},
    },
    getStateFork: {
      args: ["head"],
      res: {data: config.types.phase0.Fork.defaultValue()},
    },
    getStateFinalityCheckpoints: {
      args: ["head"],
      res: {
        data: {
          previousJustified: config.types.phase0.Checkpoint.defaultValue(),
          currentJustified: config.types.phase0.Checkpoint.defaultValue(),
          finalized: config.types.phase0.Checkpoint.defaultValue(),
        },
      },
    },
    getStateValidators: {
      args: ["head", {indices: [1300], statuses: ["active_ongoing"]}],
      res: {data: [validatorResponse]},
    },
    getStateValidator: {
      args: ["head", toHexString(Buffer.alloc(48, 1))],
      res: {data: validatorResponse},
    },
    getStateValidatorBalances: {
      args: ["head", [1300]],
      res: {data: [{index: 1300, balance}]},
    },
    getEpochCommittees: {
      args: ["head", {index: 1, slot: 2, epoch: 3}],
      res: {data: [{index: 1, slot: 2, validators: [1300]}]},
    },
    getEpochSyncCommittees: {
      args: ["head", 1],
      res: {data: {validators: [1300], validatorAggregates: [1300]}},
    },

    // -

    getGenesis: {
      args: [],
      res: {data: config.types.phase0.Genesis.defaultValue()},
    },
  });
});
