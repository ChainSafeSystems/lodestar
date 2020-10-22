import {createKeypairFromPeerId, ENR, ENRKey, ENRValue} from "@chainsafe/discv5";
import {writeFileSync} from "fs";
import PeerId from "peer-id";
import {readFileSync} from "../../util";

export class FileENR extends ENR {
  private filename: string;
  private localPeerId: PeerId;

  constructor(filename: string, peerId: PeerId) {
    super();
    this.filename = filename;
    this.localPeerId = peerId;
  }

  static initFromFile(filename: string, peerId: PeerId): FileENR {
    const enr = FileENR.decodeTxt(readFileSync(filename)) as FileENR;
    Object.setPrototypeOf(enr, FileENR.prototype);
    enr.filename = filename;
    enr.localPeerId = peerId;
    return enr;
  }

  set(key: ENRKey, value: ENRValue): this {
    super.set(key, value);
    const keypair = createKeypairFromPeerId(this.localPeerId);
    writeFileSync(this.filename, this.encodeTxt(keypair.privateKey));
    return this;
  }
}
