import { WAConnection, WAConnectOptions } from '@adiwajshing/baileys';

interface SharkOptions {
  ownerID: string | string[];
}

export class SharkClient extends WAConnection {
  ownerID: string | string[];
  constructor(options: SharkOptions, clientOptions?: WAConnectOptions) {
    super();
    const { ownerID } = options;

    this.ownerID = ownerID;
    if (clientOptions) this.connectOptions = clientOptions;
  }

  public isOwner(user: string): boolean {
    const id = this.contactAddOrGet(user);
    return Array.isArray(this.ownerID) ? this.ownerID.includes(id.jid) : id.jid === this.ownerID;
  }
}

export default SharkClient;
