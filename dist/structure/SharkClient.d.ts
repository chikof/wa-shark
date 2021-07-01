import { WAConnection, WAConnectOptions } from '@adiwajshing/baileys';
export interface SharkOptions {
    ownerID: string | string[];
    session: string;
}
export declare class SharkClient extends WAConnection {
    ownerID: string | string[];
    session: string;
    constructor(options: SharkOptions, clientOptions?: WAConnectOptions);
    isOwner(user: string): boolean;
}
export default SharkClient;
