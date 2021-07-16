import { WAChatUpdate } from '@adiwajshing/baileys';
import { SharkClient } from '../SharkClient';
import { SharkHandler } from '../SharkHandler';
import { Command } from './Command';
import { InhibitorHandler } from '../inhibitors/InhibitorHandler';
import { Collection } from '../../util';
import { CommandHandlerOptions } from '../../util/types';
export declare class CommandHandler extends SharkHandler {
    aliases: Collection<string, string>;
    aliasReplacement: string | RegExp;
    prefixes: Collection<any, any>;
    blockClient: boolean;
    storeMessages: boolean;
    ignoreCooldown: () => string | string[];
    cooldown: Collection<unknown, unknown>;
    defaultCooldown: number;
    prefix: () => string | string[];
    inhibitorHandler: InhibitorHandler;
    cooldowns: Collection<any, any>;
    modules: Collection<string, Command>;
    constructor(client: SharkClient, options?: CommandHandlerOptions);
    setup(): void;
    handle(message: WAChatUpdate): Promise<boolean>;
    register(command: Command, filepath: string): void;
    deregister(command: Command): void;
    runCooldowns(message: WAChatUpdate, command: Command): boolean;
    runCommand(message: WAChatUpdate, command: Command, args: any): Promise<boolean>;
    parseCommand(message: WAChatUpdate): Promise<{
        prefix?: undefined;
        alias?: undefined;
        content?: undefined;
        afterPrefix?: undefined;
        command?: undefined;
    } | {
        prefix: string;
        alias: string;
        content: string;
        afterPrefix: string;
        command?: undefined;
    } | {
        command: Command;
        prefix: string;
        alias: string;
        content: string;
        afterPrefix: string;
    }>;
    parseMultiplePrefixes(message: WAChatUpdate, pairs: any[]): {
        prefix?: undefined;
        alias?: undefined;
        content?: undefined;
        afterPrefix?: undefined;
        command?: undefined;
    } | {
        prefix: string;
        alias: string;
        content: string;
        afterPrefix: string;
        command?: undefined;
    } | {
        command: Command;
        prefix: string;
        alias: string;
        content: string;
        afterPrefix: string;
    };
    parseWithPrefix(message: WAChatUpdate, prefix: string, associatedCommands?: Set<string>): {
        prefix?: undefined;
        alias?: undefined;
        content?: undefined;
        afterPrefix?: undefined;
        command?: undefined;
    } | {
        prefix: string;
        alias: string;
        content: string;
        afterPrefix: string;
        command?: undefined;
    } | {
        command: Command;
        prefix: string;
        alias: string;
        content: string;
        afterPrefix: string;
    };
    findCommand(name: string): Command;
    runAllTypeInhibitors(message: WAChatUpdate): Promise<boolean>;
    runPostTypeInhibitors(message: WAChatUpdate, command: Command): Promise<boolean>;
    runPreTypeInhibitors(message: WAChatUpdate): Promise<boolean>;
    parseCommandOverwrittenPrefixes(message: WAChatUpdate): Promise<{
        prefix?: undefined;
        alias?: undefined;
        content?: undefined;
        afterPrefix?: undefined;
        command?: undefined;
    } | {
        prefix: string;
        alias: string;
        content: string;
        afterPrefix: string;
        command?: undefined;
    } | {
        command: Command;
        prefix: string;
        alias: string;
        content: string;
        afterPrefix: string;
    }>;
    useInhibitorHandler(inhibitorHandler: InhibitorHandler): this;
}
export default CommandHandler;
