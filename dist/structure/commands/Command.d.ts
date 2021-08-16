import { WAChatUpdate } from '@adiwajshing/baileys';
import { SharkModule } from '../SharkModule';
import { CommandOptions, IgnoreCheckPredicate } from '../../util/types';
export declare class Command extends SharkModule {
    aliases: string[] | [];
    prefix: string | string[];
    cooldown: number;
    ratelimit: number;
    description: {
        [x: string]: any;
    };
    filters: {
        botOwner?: boolean;
        allowDM?: boolean;
        allowGroups?: boolean;
        ignoreCooldown?: string | string[] | IgnoreCheckPredicate;
        groupAdmin?: boolean;
        groupOwner?: boolean;
    };
    constructor(id: string, options: CommandOptions);
    exec(message: WAChatUpdate, args?: any): Promise<any>;
}
export default Command;
