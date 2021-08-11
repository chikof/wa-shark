import { WAChatUpdate } from '@adiwajshing/baileys';
import { SharkClient } from '../SharkClient';
import { SharkHandler } from '../SharkHandler';
import { Command } from './Command';
import { InhibitorHandler } from '../inhibitors/InhibitorHandler';
import { Category, Collection } from '../../util';
import { CommandHandlerOptions, CooldownData, IgnoreCooldownFuntion, ParsedComponentData, Prefix } from '../../util/types';
export declare class CommandHandler extends SharkHandler {
    aliases: Collection<string, string>;
    aliasReplacement: string | RegExp;
    prefixes: Collection<string, Set<string>>;
    blockClient: boolean;
    ignoreCooldown: string | string[] | IgnoreCooldownFuntion;
    defaultCooldown: number;
    prefix: string | string[] | Prefix;
    inhibitorHandler: InhibitorHandler;
    cooldowns: Collection<string, {
        [id: string]: CooldownData;
    }>;
    modules: Collection<string, Command>;
    categories: Collection<string, Category<string, Command>>;
    constructor(client: SharkClient, options?: CommandHandlerOptions);
    setup(): void;
    handle(message: WAChatUpdate): Promise<boolean>;
    register(command: Command, filepath: string): void;
    deregister(command: Command): void;
    runCooldowns(message: WAChatUpdate, command: Command): boolean;
    runCommand(message: WAChatUpdate, command: Command, args: any): Promise<boolean>;
    parseCommand(message: WAChatUpdate): Promise<ParsedComponentData>;
    parseMultiplePrefixes(message: WAChatUpdate, pairs: [string, Set<string> | null][]): ParsedComponentData;
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
    parseCommandOverwrittenPrefixes(message: WAChatUpdate): Promise<ParsedComponentData>;
    useInhibitorHandler(inhibitorHandler: InhibitorHandler): this;
}
export default CommandHandler;
