import { WAChatUpdate } from '@adiwajshing/baileys';
import { Command } from '../commands/Command';
import { SharkModule } from '../SharkModule';
import { InhibitorOptions } from '../../util/types';
export declare class Inhibitor extends SharkModule {
    reason: string;
    type: string;
    priority: number;
    constructor(id: string, options?: InhibitorOptions);
    exec(message: WAChatUpdate, command?: Command): boolean | Promise<boolean>;
}
export default Inhibitor;
