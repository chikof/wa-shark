import { SharkHandler } from '../SharkHandler';
import { Command } from './Command';
import { Collection, SharkError, Util } from '../../util';
const { intoArray, intoCallable, prefixCompare, flatMap } = Util;
export class CommandHandler extends SharkHandler {
    aliases;
    aliasReplacement;
    prefixes;
    blockClient;
    ignoreCooldown;
    defaultCooldown;
    prefix;
    inhibitorHandler;
    cooldowns;
    constructor(client, options) {
        super(client, {
            directory: options.directory,
            extensions: options.extensions || ['.js', '.ts'],
        });
        options.classToHandle = options.classToHandle || Command;
        this.classToHandle = options.classToHandle;
        if (options.classToHandle.constructor.prototype instanceof Command ||
            this.classToHandle.constructor.prototype === Command) {
            throw new SharkError('INVALID_CLASS_TO_HANDLE', this.classToHandle.constructor.name, Command.name);
        }
        this.aliases = new Collection();
        this.aliasReplacement = options.aliasReplacement;
        this.prefixes = new Collection();
        this.blockClient = Boolean(options.blockClient);
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
    setup() {
        this.client.on('chat-update', (m) => {
            this.handle(m);
        });
    }
    async handle(message) {
        try {
            let parsed = await this.parseCommand(message);
            if (await this.runAllTypeInhibitors(message)) {
                return false;
            }
            if (await this.runPreTypeInhibitors(message)) {
                return false;
            }
            if (!parsed.command) {
                const overParsed = await this.parseCommandOverwrittenPrefixes(message);
                if (overParsed.command || (parsed.prefix == null && overParsed.prefix != null)) {
                    parsed = overParsed;
                }
            }
            if (parsed.command)
                this.runCommand(message, parsed.command, parsed.content);
        }
        catch (err) {
            this.emit('COMMAND_ERROR', message);
            return null;
        }
    }
    register(command, filepath) {
        super.register(command, filepath);
        for (let alias of command.aliases) {
            const conflict = this.aliases.get(alias.toLowerCase());
            if (conflict)
                throw new SharkError('ALIAS_CONFLICT', alias, command.id, conflict);
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
                    }
                    else {
                        this.prefixes.set(prefix, new Set([command.id]));
                        newEntry = true;
                    }
                }
            }
            else {
                const prefixes = this.prefixes.get(command.prefix);
                if (prefixes) {
                    prefixes.add(command.id);
                }
                else {
                    this.prefixes.set(command.prefix, new Set([command.id]));
                    newEntry = true;
                }
            }
            if (newEntry) {
                this.prefixes = this.prefixes.sort((_aVal, _bVal, aKey, bKey) => prefixCompare(aKey, bKey));
            }
        }
    }
    deregister(command) {
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
                    }
                    else {
                        prefixes.delete(prefix);
                    }
                }
            }
            else {
                const prefixes = this.prefixes.get(command.prefix);
                if (prefixes.size === 1) {
                    this.prefixes.delete(command.prefix);
                }
                else {
                    prefixes.delete(command.prefix);
                }
            }
        }
        super.deregister(command);
    }
    runCooldowns(message, command) {
        const ignorer = command.ignoreCooldown || this.ignoreCooldown;
        const id = /@s.whatsapp.net/g.test(message.jid)
            ? message.jid
            : message.messages.first.participant;
        const isIgnored = Array.isArray(ignorer)
            ? ignorer.includes(message.jid)
            : typeof ignorer === 'function'
                ? ignorer(message, command)
                : id === ignorer;
        if (isIgnored)
            return false;
        const time = command.cooldown ?? this.defaultCooldown;
        if (!time)
            return false;
        const endTime = Date.now() - 100 + time;
        if (!this.cooldowns.has(id))
            this.cooldowns.set(id, {});
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
            const end = this.cooldowns.get(id)[command.id].end;
            const diff = end - Date.now() - 100;
            this.emit('COMMAND_COOLDOWN', message, command, diff);
            return true;
        }
        entry.uses++;
        return false;
    }
    async runCommand(message, command, args) {
        if (await this.runPostTypeInhibitors(message, command))
            return false;
        this.emit('COMMAND_STARTED', message, command, args);
        const ret = await command.exec(message, args);
        this.emit('COMMAND_FINISHED', message, command, args, ret);
    }
    async parseCommand(message) {
        let prefixes = intoArray(await intoCallable(this.prefix)(message));
        const allowMention = await intoCallable(this.prefix)(message);
        if (allowMention) {
            const mentions = [`@${this.client.user.jid}`];
            prefixes = [...mentions, ...prefixes];
        }
        prefixes.sort(prefixCompare);
        return this.parseMultiplePrefixes(message, prefixes.map((p) => [p, null]));
    }
    parseMultiplePrefixes(message, pairs) {
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
    parseWithPrefix(message, prefix, associatedCommands = null) {
        if (!message.messages)
            return;
        const msg = message.messages.first.message;
        if (!msg)
            return;
        const messageContent = msg.conversation ??
            (msg.imageMessage && msg.imageMessage.caption) ??
            (msg.videoMessage && msg.videoMessage.caption) ??
            (msg.extendedTextMessage && msg.extendedTextMessage.text) ??
            '';
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
        }
        else if (!associatedCommands.has(command.id)) {
            return { prefix, alias, content, afterPrefix };
        }
        return { command, prefix, alias, content, afterPrefix };
    }
    findCommand(name) {
        return this.modules.get(this.aliases.get(name.toLowerCase()));
    }
    async runAllTypeInhibitors(message) {
        const reason = this.inhibitorHandler ? await this.inhibitorHandler.test('all', message) : null;
        if (reason != null) {
            this.emit('MESSAGE_BLOCKED', message, reason);
        }
        else if (this.blockClient &&
            message.messages.first.key.participant === this.client.user.jid) {
            this.emit('MESSAGE_BLOCKED', message, 'Client');
        }
        else {
            return false;
        }
        return true;
    }
    async runPostTypeInhibitors(message, command) {
        const msg = message.messages.first;
        const id = /@s.whatsapp.net/g.test(message.jid) ? message.jid : msg.participant;
        if (command.ownerOnly) {
            const isOwner = this.client.isOwner(id);
            if (!isOwner) {
                this.emit('COMMAND_BLOCKED', message, command, 'Owner');
                return true;
            }
        }
        if (!command.allowGroups && message.jid.endsWith('@g.us')) {
            this.emit('COMMAND_BLOCKED', message, command, 'Group');
            return true;
        }
        if (!command.allowDM && !message.jid.endsWith('@g.us')) {
            this.emit('COMMAND_BLOCKED', message, command, 'Private messages');
            return true;
        }
        const reason = this.inhibitorHandler
            ? await this.inhibitorHandler.test('post', message, command)
            : null;
        if (reason != null) {
            this.emit('COMMAND_BLOCKED', message, command, reason);
            return true;
        }
        if (this.runCooldowns(message, command)) {
            return true;
        }
        return false;
    }
    async runPreTypeInhibitors(message) {
        const reason = this.inhibitorHandler ? await this.inhibitorHandler.test('pre', message) : null;
        if (reason != null) {
            this.emit('MESSAGE_BLOCKED', message, reason);
        }
        else {
            return false;
        }
        return true;
    }
    async parseCommandOverwrittenPrefixes(message) {
        if (!this.prefixes.size) {
            return {};
        }
        const promises = this.prefixes.map(async (cmds, provider) => {
            const prefixes = intoArray(await intoCallable(provider)(message));
            return prefixes.map((p) => [p, cmds]);
        });
        const pairs = flatMap(await Promise.all(promises), (x) => x);
        pairs.sort(([a], [b]) => prefixCompare(a, b));
        return this.parseMultiplePrefixes(message, pairs);
    }
    useInhibitorHandler(inhibitorHandler) {
        this.inhibitorHandler = inhibitorHandler;
        return this;
    }
}
export default CommandHandler;
