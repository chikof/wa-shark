/// <reference types="node" />
import { EventEmitter } from 'events';
export declare type LoadPredicate = (filepath?: string) => boolean;
export interface SharkModuleOptions {
    category?: string;
}
export interface SharkHandlerOptions {
    automateCategories?: boolean;
    classToHandle?: any;
    directory: string;
    extensions?: string[] | Set<string>;
    loadFilter?: LoadPredicate;
}
export interface ListenerOptions extends SharkModuleOptions {
    emitter: string | EventEmitter;
    event: string;
    type?: string;
}
export interface InhibitorOptions extends SharkModuleOptions {
    reason?: string;
    type?: string;
    priority?: number;
}
export interface CommandOptions extends SharkModuleOptions {
    alias: string[];
    allowDM?: boolean;
    allowGroups?: boolean;
    cooldown?: number;
    ignoreCooldown?: string | string[];
    lock?: boolean;
    ratelimit?: number;
    ownerOnly?: boolean;
    prefix?: string | string[];
    description: {
        [x: string]: any;
    };
}
export interface SharkClientOptions {
    ownerID: string | string[];
    sessionPath: string;
}
export interface CommandHandlerOptions extends SharkHandlerOptions {
    blockClient?: boolean;
    storeMessages?: boolean;
    defaultCooldown?: number;
    ignoreCooldown?: () => string | string[];
    prefix: () => string | string[];
    aliasReplacement?: string | RegExp;
}
