import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {jsonOpts} from "../utils";
import {ServerRoutes, getGenericJsonServer} from "./utils";
import {Api, ReqTypes, routesData, getReturnTypes, getReqSerializers} from "../routes/debug";

const mimeTypeSSZ = "application/octet-stream";

export function getRoutes(config: IBeaconConfig, api: Api): ServerRoutes<Api, ReqTypes> {
  const reqSerializers = getReqSerializers();
  const returnTypes = getReturnTypes(config);

  const serverRoutes = getGenericJsonServer<Api, ReqTypes>(
    {routesData, getReturnTypes, getReqSerializers},
    config,
    api
  );

  return {
    getHeads: serverRoutes.getHeads,
    getState: {
      ...serverRoutes.getState,
      handler: async (req, res) => {
        const data = await api.getState(...reqSerializers.getState.parseReq(req));
        const type = config.getForkTypes(data.data.slot).BeaconState;
        if (req.headers["accept"] === mimeTypeSSZ) {
          return res.status(200).header("Content-Type", mimeTypeSSZ).send(type.serialize(data.data));
        } else {
          return returnTypes.getState.toJson(data, jsonOpts);
        }
      },
    },
    getStateV2: {
      ...serverRoutes.getStateV2,
      handler: async (req, res) => {
        const data = await api.getStateV2(...reqSerializers.getStateV2.parseReq(req));
        const type = config.getForkTypes(data.data.slot).BeaconState;
        if (req.headers["accept"] === mimeTypeSSZ) {
          return res.status(200).header("Content-Type", mimeTypeSSZ).send(type.serialize(data.data));
        } else {
          return returnTypes.getStateV2.toJson(data, jsonOpts);
        }
      },
    },
  };
}
