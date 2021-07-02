import { WAChatUpdate } from '@adiwajshing/baileys';

import { Collection, SharkError, Util } from '../../util';
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

const { intoArray, intoCallable, prefixCompare } = Util;

export class CommandHandler extends SharkHandler {
  public aliases: Collection<string, string>;
  public aliasReplacement: string | RegExp;
  public prefixes: Collection<any, any>;
  public blockClient: boolean;
  public storeMessages: boolean;
  public ignoreCooldown: () => string | string[];
  public cooldown: Collection<unknown, unknown>;
  public defaultCooldown: number;
  public prefix: () => string | string[];
  public inhibitorHandler: any;
  public cooldowns: Collection<any, any>;

  constructor(client: SharkClient, options?: SharkOptions & SharkHandlerOptions) {
    super(client, {
      directory: options.directory,
      extensions: options.extensions || ['.js', '.ts'],
    });

    options.classToHandle = options.classToHandle ? options.classToHandle : Command;
    this.classToHandle = options.classToHandle;
    if (
      options.classToHandle.constructor.prototype instanceof Command ||
      this.classToHandle.constructor.prototype === Command
    ) {
      throw new SharkError(
        'INVALID_CLASS_TO_HANDLE',
        this.classToHandle.constructor.name,
        Command.name,
      );
    }

    this.aliases = new Collection();

    this.aliasReplacement = options.aliasReplacement;

    this.prefixes = new Collection();

    this.blockClient = Boolean(options.blockClient);

    this.storeMessages = Boolean(options.storeMessages);

    this.cooldown = new Collection();

    this.cooldowns = new Collection();

    this.defaultCooldown = options.defaultCooldown;

    this.ignoreCooldown =
      typeof options.ignoreCooldown == 'function'
        ? options.ignoreCooldown.bind(this)
        : options.ignoreCooldown;

    this.prefix = typeof options.prefix === 'function' ? options.prefix.bind(this) : options.prefix;

    this.inhibitorHandler = null;

    this.setup();
  }

  public setup() {
    this.client.on('open', () => {
      this.client.on('chat-update', async (m) => {
        this.handle(m);
      });
    });
  }

  public async handle(message: WAChatUpdate) {
    const parsed = await this.parseCommand(message);
    if (parsed.command && !this.cooldowns.has(message.messages.first.key.participant)) {
      this.runCommand(message, parsed.command, parsed.content);
    }
  }

  public register(command: Command, filepath: string) {
    super.register(command, filepath);
    for (let alias of command.aliases) {
      const conflict = this.aliases.get(alias.toLowerCase());
      if (conflict) throw new SharkError('ALIAS_CONFLICT', alias, command.id, conflict);

      alias = alias.toLowerCase();
      this.aliases.set(alias, command.id);
      if (this.aliasReplacement) {
        const replacement = alias.replace(this.aliasReplacement, '');

        if (replacement !== alias) {
          const replacementConflict = this.aliases.get(replacement);
          if (replacementConflict) {
            throw new SharkError('ALIAS_CONFLICT', replacement, command.id, replacementConflict);
          }

          this.aliases.set(replacement, command.id);
        }
      }
    }

    if (command.prefix != null) {
      let newEntry = false;

      if (Array.isArray(command.prefix)) {
        for (const prefix of command.prefix) {
          const prefixes = this.prefixes.get(prefix);
          if (prefixes) {
            prefixes.add(command.id);
          } else {
            this.prefixes.set(prefix, new Set([command.id]));
            newEntry = true;
          }
        }
      } else {
        const prefixes = this.prefixes.get(command.prefix);
        if (prefixes) {
          prefixes.add(command.id);
        } else {
          this.prefixes.set(command.prefix, new Set([command.id]));
          newEntry = true;
        }
      }

      if (newEntry) {
        this.prefixes = this.prefixes.sort((aVal, bVal, aKey, bKey) => prefixCompare(aKey, bKey));
      }
    }
  }

  public deregister(command: Command) {
    for (let alias of command.aliases) {
      alias = alias.toLowerCase();
      this.aliases.delete(alias);

      if (this.aliasReplacement) {
        const replacement = alias.replace(this.aliasReplacement, '');
        if (replacement !== alias) {
          this.aliases.delete(replacement);
        }
      }
    }

    if (command.prefix != null) {
      if (Array.isArray(command.prefix)) {
        for (const prefix of command.prefix) {
          const prefixes = this.prefixes.get(prefix);
          if (prefixes.size === 1) {
            this.prefixes.delete(prefix);
          } else {
            prefixes.delete(prefix);
          }
        }
      } else {
        const prefixes = this.prefixes.get(command.prefix);
        if (prefixes.size === 1) {
          this.prefixes.delete(command.prefix);
        } else {
          prefixes.delete(command.prefix);
        }
      }
    }

    super.deregister(command);
  }

  public runCooldowns(message: WAChatUpdate, command: Command) {
    const ignorer = command.ignoreCooldown || this.ignoreCooldown;
    const isIgnored = Array.isArray(ignorer)
      ? ignorer.includes(message.jid)
      : typeof ignorer === 'function'
      ? ignorer(message, command)
      : message.jid === ignorer;

    if (isIgnored) return false;

    const time = command.cooldown != null ? command.cooldown : this.defaultCooldown;
    if (!time) return false;

    const endTime = Date.now() - 100 + time;

    const id = message.jid;
    if (!this.cooldowns.has(id)) this.cooldowns.set(id, {});

    if (!this.cooldowns.get(id)[command.id]) {
      this.cooldowns.get(id)[command.id] = {
        timer: setTimeout(() => {
          if (this.cooldowns.get(id)[command.id]) {
            clearTimeout(this.cooldowns.get(id)[command.id].timer);
          }

          this.cooldowns.get(id)[command.id] = null;

          if (!Object.keys(this.cooldowns.get(id)).length) {
            this.cooldowns.delete(id);
          }
        }, time),
        end: endTime,
        uses: 0,
      };
    }

    const entry = this.cooldowns.get(id)[command.id];

    if (entry.uses >= command.ratelimit) {
      const end = this.cooldowns.get(message.jid)[command.id].end;
      const diff = end - Date.now() - 100;

      this.emit('cooldown', message, command, diff);
      return true;
    }

    entry.uses++;
    return false;
  }

  async runCommand(message: WAChatUpdate, command: Command, args: any) {
    this.emit('commandStarted', message, command, args);
    const ret = await command.exec(message, args);
    this.emit('commandFinished', message, command, args, ret);
  }

  public async parseCommand(message: WAChatUpdate) {
    let prefixes = intoArray(await intoCallable(this.prefix)(message));
    const allowMention = await intoCallable(this.prefix)(message);

    if (allowMention) {
      const mentions = [`@${this.client.user.jid}`];
      prefixes = [...mentions, ...prefixes];
    }

    prefixes.sort(prefixCompare);
    return this.parseMultiplePrefixes(
      message,
      prefixes.map((p) => [p, null]),
    );
  }

  public parseMultiplePrefixes(message: WAChatUpdate, pairs: any[]) {
    const parses = pairs.map(([prefix, cmds]) => this.parseWithPrefix(message, prefix, cmds));
    const result = parses.find((parsed) => parsed && parsed.command);

    if (result) {
      return result;
    }

    const guess = parses.find((parsed) => parsed && parsed.prefix != null);
    if (guess) {
      return guess;
    }

    return {};
  }

  public parseWithPrefix(
    message: WAChatUpdate,
    prefix: string,
    associatedCommands: Set<string> = null,
  ) {
    if (!message.messages) return;
    const messageContent = message.messages.first.message.conversation;
    const lowerContent = messageContent.toLowerCase();
    if (!lowerContent.startsWith(prefix.toLowerCase())) {
      return {};
    }

    const endOfPrefix = lowerContent.indexOf(prefix.toLowerCase()) + prefix.length;
    const startOfArgs = messageContent.slice(endOfPrefix).search(/\S/) + prefix.length;
    const alias = messageContent.slice(startOfArgs).split(/\s{1,}|\n{1,}/)[0];
    const command = this.findCommand(alias);
    const content = messageContent.slice(startOfArgs + alias.length + 1).trim();
    const afterPrefix = messageContent.slice(prefix.length).trim();

    if (!command) {
      return { prefix, alias, content, afterPrefix };
    }

    if (associatedCommands == null) {
      if (command.prefix != null) {
        return { prefix, alias, content, afterPrefix };
      }
    } else if (!associatedCommands.has(command.id)) {
      return { prefix, alias, content, afterPrefix };
    }

    return { command, prefix, alias, content, afterPrefix };
  }

  public findCommand(name: string) {
    return this.modules.get(this.aliases.get(name.toLowerCase())) as Command;
  }
}
