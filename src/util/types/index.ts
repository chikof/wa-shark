import { WAChatUpdate } from '@adiwajshing/baileys';
import { EventEmitter } from 'events';
import { Command } from '../..';

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
  ignoreCooldown?: string | string[] | IgnoreCheckPredicate;
  ratelimit?: number;
  ownerOnly?: boolean;
  prefix?: string | string[];
  description?: { [x: string]: any };
}

export interface SharkClientOptions {
  ownerID?: string | string[];
  sessionPath: string;
}

export interface CommandHandlerOptions extends SharkHandlerOptions {
  blockClient?: boolean;
  storeMessages?: boolean;
  defaultCooldown?: number;
  ignoreCooldown?: string | string[] | IgnoreCooldownFuntion;
  prefix: string | string[] | Prefix;
  aliasReplacement?: string | RegExp;
}

export interface ParsedComponentData {
  afterPrefix?: string;
  alias?: string;
  command?: Command;
  content?: string;
  prefix?: string;
}

export interface CooldownData {
  end: number;
  timer: NodeJS.Timer;
  uses: number;
}

export type IgnoreCheckPredicate = (message: WAChatUpdate, command: Command) => boolean;

export type Prefix = (message: WAChatUpdate) => string | string[];

export type IgnoreCooldownFuntion = (message: WAChatUpdate) => string | string[];

export type LoadPredicate = (filepath?: string) => boolean;
