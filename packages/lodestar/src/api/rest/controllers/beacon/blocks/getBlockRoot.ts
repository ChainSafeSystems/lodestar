import {ApiController} from "../../types";
import {DefaultQuery} from "fastify";

export const getBlockRoot: ApiController<DefaultQuery, {blockId: string}> = {
  url: "/blocks/:blockId/root",
  method: "GET",

  handler: async function (req) {
    const data = await this.api.beacon.blocks.getBlock(req.params.blockId);
    return {
      data: {
        root: this.config.types.Root.toJson(this.config.types.phase0.BeaconBlock.hashTreeRoot(data.message)),
      },
    };
  },

  schema: {
    params: {
      type: "object",
      required: ["blockId"],
      properties: {
        blockId: {
          types: "string",
        },
      },
    },
  },
};
