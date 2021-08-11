import { WAChatUpdate } from '@adiwajshing/baileys';
import { SharkModule } from '../SharkModule';
import { CommandOptions, IgnoreCheckPredicate } from '../../util/types';
export declare class Command extends SharkModule {
    aliases: string[] | [];
    allowDM: boolean;
    allowGroups: boolean;
    prefix: string | string[];
    ownerOnly: boolean;
    cooldown: number;
    ratelimit: number;
    ignoreCooldown: string | string[] | IgnoreCheckPredicate;
    description: {
        [x: string]: any;
    };
    constructor(id: string, options: CommandOptions);
    exec(message: WAChatUpdate, args?: any): Promise<any>;
}
export default Command;
