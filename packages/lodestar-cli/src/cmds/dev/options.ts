import {ICliCommandOptions} from "../../util";
import {beaconOptions, IBeaconOptions} from "../beacon/options";

interface IDevGroupOptions {
  genesisValidators?: number;
  startValidators?: string;
  reset?: boolean;
  server: string;
}

const devGroupOptions: ICliCommandOptions<IDevGroupOptions> = {
  genesisValidators: {
    description: "If present it will create genesis with interop validators and start chain.",
    type: "number",
    group: "dev",
  },

  startValidators: {
    description: "Start interop validators in given range",
    default: "0:8",
    type: "string",
    group: "dev",
  },

  reset: {
    description: "To delete chain and validator directories",
    type: "boolean",
    group: "dev",
  },

  server: {
    description: "Address to connect to BeaconNode. Pass 'memory' for in memory communication",
    default: "http://127.0.0.1:9596",
    type: "string",
  }
};

export const devRunOptions = {
  ...beaconOptions,
  ...devGroupOptions
};

export type IDevOptions =
  IDevGroupOptions &
  IBeaconOptions;
