import { WAConnection, WAConnectOptions } from '@adiwajshing/baileys';
declare interface SharkOptions {
    ownerID: string | string[];
}
export declare class SharkClient extends WAConnection {
    ownerID: string | string[];
    constructor(options: SharkOptions, clientOptions?: WAConnectOptions);
    isOwner(user: string): boolean;
}
export default SharkClient;
