import { WAChatUpdate } from '@adiwajshing/baileys';
import { Collection } from '../../util';
import { SharkHandlerOptions } from '../../util/types';
import SharkClient from '../SharkClient';
import { SharkHandler } from '../SharkHandler';
import { Command } from './Command';
declare interface SharkOptions {
    loadfilter?: () => boolean;
    blockClient?: boolean;
    storeMessages?: boolean;
    defaultCooldown?: number;
    ignoreCooldown?: () => string | string[];
    prefix?: () => string | string[];
    aliasReplacement?: string | RegExp;
}
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
    inhibitorHandler: any;
    cooldowns: Collection<any, any>;
    constructor(client: SharkClient, options?: SharkOptions & SharkHandlerOptions);
    setup(): void;
    handle(message: WAChatUpdate): Promise<void>;
    register(command: Command, filepath: string): void;
    deregister(command: Command): void;
    runCooldowns(message: WAChatUpdate, command: Command): boolean;
    runCommand(message: WAChatUpdate, command: Command, args: any): Promise<void>;
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
}
export {};
