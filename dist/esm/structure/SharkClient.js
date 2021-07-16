import { WAConnection } from '@adiwajshing/baileys';
import { existsSync, writeFileSync } from 'fs';
export class SharkClient extends WAConnection {
    ownerID;
    session;
    constructor(options, clientOptions) {
        super();
        this.ownerID = options.ownerID;
        if (clientOptions)
            this.connectOptions = clientOptions;
        this.session = options.sessionPath;
        if (existsSync(this.session)) {
            this.loadAuthInfo(this.session);
        }
        else {
            this.on('open', () => {
                writeFileSync(this.session, JSON.stringify(this.base64EncodedAuthInfo()), {
                    encoding: 'utf8',
                });
            });
        }
    }
    isOwner(user) {
        const id = this.contactAddOrGet(user);
        return Array.isArray(this.ownerID) ? this.ownerID.includes(id.jid) : id.jid === this.ownerID;
    }
}
export default SharkClient;
