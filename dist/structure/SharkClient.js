"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharkClient = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const fs_1 = require("fs");
class SharkClient extends baileys_1.WAConnection {
    ownerID;
    session;
    constructor(options, clientOptions) {
        super();
        this.ownerID = options.ownerID;
        if (clientOptions)
            this.connectOptions = clientOptions;
        this.session = options.session;
        if (fs_1.existsSync(this.session)) {
            this.loadAuthInfo(this.session);
        }
        else {
            this.on('open', () => {
                fs_1.writeFileSync(this.session, JSON.stringify(this.base64EncodedAuthInfo()), {
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
exports.SharkClient = SharkClient;
exports.default = SharkClient;
