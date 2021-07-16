import { WAConnection, WAConnectOptions } from '@adiwajshing/baileys';

import { existsSync, writeFileSync } from 'fs';

import { SharkClientOptions } from '../util/types';

export class SharkClient extends WAConnection {
  public ownerID: string | string[];
  public session: string;

  constructor(options: SharkClientOptions, clientOptions?: WAConnectOptions) {
    super();

    this.ownerID = options.ownerID;

    if (clientOptions) this.connectOptions = clientOptions;

    this.session = options.sessionPath;

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
