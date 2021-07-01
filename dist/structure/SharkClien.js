"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharkClient = void 0;
const baileys_1 = require("@adiwajshing/baileys");
class SharkClient extends baileys_1.WAConnection {
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
exports.SharkClient = SharkClient;
exports.default = SharkClient;
