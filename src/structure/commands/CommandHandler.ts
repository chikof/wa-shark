import { WAChatUpdate, WAConnection } from '@adiwajshing/baileys';

import { Collection, SharkError, Util } from '../../util';
import { SharkHandler } from '../SharkHandler';
import { Command } from './Command';

interface SharkOptions {
  directory: string;
  classToHandle?: Command;
  automateCategories?: any;
  loadFilter?: any;
  blockClient?: boolean;
  storeMessages?: boolean;
  defaultCooldown?: number;
  ignoreCooldown?: any;
  // argumentDefaults: { [key: string]: unknown };
  prefix?: any;
  aliasReplacement: any;
}

export class CommandHandler extends SharkHandler {
  aliases: Collection<string, string>;
  aliasReplacement: any;
  prefixes: Collection<any, any>;
  blockClient: boolean;
  storeMessages: boolean;
  ignoreCooldown: any;
  cooldown: Collection<unknown, unknown>;
  defaultCooldown: number;
  prefix: any;
  inhibitorHandler: any;
  cooldowns: Collection<any, any>;
  constructor(client: WAConnection, options?: SharkOptions) {
    super(client);

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
    this.client.on('open', (w) => {
      w;
    });
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
          if (replacementConflict)
            throw new SharkError('ALIAS_CONFLICT', replacement, command.id, replacementConflict);
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
        this.prefixes = this.prefixes.sort((aVal, bVal, aKey, bKey) =>
          Util.prefixCompare(aKey, bKey),
        );
      }
    }
  }

  deregister(command: Command) {
    for (let alias of command.aliases) {
      alias = alias.toLowerCase();
      this.aliases.delete(alias);

      if (this.aliasReplacement) {
        const replacement = alias.replace(this.aliasReplacement, '');
        if (replacement !== alias) this.aliases.delete(replacement);
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

  // public async handle(message) {
  //   try {
  //     if (this.fetchMembers && message.guild && !message.member && !message.webhookID) {
  //       await message.guild.members.fetch(message.author);
  //     }

  //     if (await this.runAllTypeInhibitors(message)) {
  //       return false;
  //     }

  //     if (this.commandUtil) {
  //       if (this.commandUtils.has(message.id)) {
  //         message.util = this.commandUtils.get(message.id);
  //       } else {
  //         message.util = new CommandUtil(this, message);
  //         this.commandUtils.set(message.id, message.util);
  //       }
  //     }

  //     if (await this.runPreTypeInhibitors(message)) {
  //       return false;
  //     }

  //     let parsed = await this.parseCommand(message);
  //     if (!parsed.command) {
  //       const overParsed = await this.parseCommandOverwrittenPrefixes(message);
  //       if (overParsed.command || (parsed.prefix == null && overParsed.prefix != null)) {
  //         parsed = overParsed;
  //       }
  //     }

  //     if (this.commandUtil) {
  //       message.util.parsed = parsed;
  //     }

  //     let ran;
  //     if (!parsed.command) {
  //       ran = await this.handleRegexAndConditionalCommands(message);
  //     } else {
  //       ran = await this.handleDirectCommand(message, parsed.content, parsed.command);
  //     }

  //     if (ran === false) {
  //       this.emit(CommandHandlerEvents.MESSAGE_INVALID, message);
  //       return false;
  //     }

  //     return ran;
  //   } catch (err) {
  //     this.emitError(err, message);
  //     return null;
  //   }
  // }

  runCooldowns(message: WAChatUpdate, command) {
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
}
