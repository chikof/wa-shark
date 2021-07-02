import { WAConnection, WAConnectOptions } from '@adiwajshing/baileys';

import { existsSync, writeFileSync } from 'fs';

export interface SharkOptions {
  ownerID: string | string[];
  session: string;
}

export class SharkClient extends WAConnection {
  public ownerID: string | string[];
  public session: string;

  constructor(options: SharkOptions, clientOptions?: WAConnectOptions) {
    super();

    this.ownerID = options.ownerID;

    if (clientOptions) this.connectOptions = clientOptions;

    this.session = options.session;

    if (existsSync(this.session)) {
      this.loadAuthInfo(this.session);
    } else {
      this.on('open', () => {
        writeFileSync(this.session, JSON.stringify(this.base64EncodedAuthInfo()), {
          encoding: 'utf8',
        });
      });
    }
  }

  public isOwner(user: string): boolean {
    const id = this.contactAddOrGet(user);
    return Array.isArray(this.ownerID) ? this.ownerID.includes(id.jid) : id.jid === this.ownerID;
  }
}

export default SharkClient;
