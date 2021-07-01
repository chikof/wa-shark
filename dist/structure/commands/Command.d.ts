import { WAChatUpdate } from '@adiwajshing/baileys';
import SharkModule from '../SharkModule';
declare interface CommandOptions {
    alias: string[];
    ownerOnly?: boolean;
    category?: string;
    cooldown?: number;
    ratelimit?: number;
    prefix?: string | string[];
    lock?: boolean;
    ignoreCooldown?: string | string[];
}
export declare class Command extends SharkModule {
    aliases: string[] | [];
    prefix: string | string[];
    ownerOnly: boolean;
    cooldown: number;
    ratelimit: number;
    lock: boolean;
    ignoreCooldown: any;
    constructor(id: string, options: CommandOptions);
    exec(message: WAChatUpdate, args?: any): Promise<any>;
}
export default Command;
