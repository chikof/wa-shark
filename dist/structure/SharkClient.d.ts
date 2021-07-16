import { WAConnection, WAConnectOptions } from '@adiwajshing/baileys';
import { SharkClientOptions } from '../util/types';
export declare class SharkClient extends WAConnection {
    ownerID: string | string[];
    session: string;
    constructor(options: SharkClientOptions, clientOptions?: WAConnectOptions);
    isOwner(user: string): boolean;
}
export default SharkClient;
