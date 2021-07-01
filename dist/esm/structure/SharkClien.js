import { WAConnection } from '@adiwajshing/baileys';
export class SharkClient extends WAConnection {
    ownerID;
    constructor(options, clientOptions) {
        super();
        const { ownerID } = options;
        this.ownerID = ownerID;
        if (clientOptions)
            this.connectOptions = clientOptions;
    }
    isOwner(user) {
        const id = this.contactAddOrGet(user);
        return Array.isArray(this.ownerID) ? this.ownerID.includes(id.jid) : id.jid === this.ownerID;
    }
}
export default SharkClient;
