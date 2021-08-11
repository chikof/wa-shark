import { WAChatUpdate } from '@adiwajshing/baileys';
import { Command } from '../commands/Command';
import { SharkClient } from '../SharkClient';
import { SharkHandler } from '../SharkHandler';
import { Inhibitor } from './Inhibitor';
import { Category, Collection } from '../../util';
import { SharkHandlerOptions } from '../../util/types';
export declare class InhibitorHandler extends SharkHandler {
    categories: Collection<string, Category<string, Inhibitor>>;
    modules: Collection<string, Inhibitor>;
    constructor(client: SharkClient, options?: SharkHandlerOptions);
    test(type: string, message: WAChatUpdate, command?: Command): Promise<string>;
}
export default InhibitorHandler;
