"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const SharkHandler_1 = require("../SharkHandler");
const Command_1 = require("./Command");
const util_1 = require("../../util");
const types_1 = require("../../util/types");
const { intoArray, intoCallable, prefixCompare, flatMap } = util_1.Util;
class CommandHandler extends SharkHandler_1.SharkHandler {
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
        this.classToHandle = options.classToHandle || Command_1.Command;
        if (options.classToHandle?.constructor?.prototype instanceof Command_1.Command ||
            this.classToHandle.constructor.prototype === Command_1.Command) {
            throw new util_1.SharkError('INVALID_CLASS_TO_HANDLE', this.classToHandle.constructor.name, Command_1.Command.name);
        }
        this.aliases = new util_1.Collection();
        this.aliasReplacement = options.aliasReplacement;
        this.prefixes = new util_1.Collection();
        this.blockClient = Boolean(options.blockClient);
        this.cooldowns = new util_1.Collection();
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
            if (!m.messages?.first)
                return;
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
            this.emitError(err, message);
            return null;
        }
    }
    register(command, filepath) {
        super.register(command, filepath);
        for (let alias of command.aliases) {
            const conflict = this.aliases.get(alias.toLowerCase());
            if (conflict)
                throw new util_1.SharkError('ALIAS_CONFLICT', alias, command.id, conflict);
            alias = alias.toLowerCase();
            this.aliases.set(alias, command.id);
            if (this.aliasReplacement) {
                const replacement = alias.replace(this.aliasReplacement, '');
                if (replacement !== alias) {
                    const replacementConflict = this.aliases.get(replacement);
                    if (replacementConflict) {
                        throw new util_1.SharkError('ALIAS_CONFLICT', replacement, command.id, replacementConflict);
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
        const ignorer = command.filters?.ignoreCooldown || this.ignoreCooldown;
        const id = this.fromJid(message);
        const isIgnored = Array.isArray(ignorer)
            ? ignorer.includes(message.jid)
            : typeof ignorer === 'function'
                ? ignorer(message, command)
                : id === ignorer;
        if (isIgnored)
            return false;
        const time = command.cooldown || this.defaultCooldown;
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
            this.emit(types_1.CommandHandlerListeners.COMMAND_COOLDOWN, message, command, diff);
            return true;
        }
        entry.uses++;
        return false;
    }
    async runCommand(message, command, args) {
        if (await this.runPostTypeInhibitors(message, command))
            return false;
        this.emit(types_1.CommandHandlerListeners.COMMAND_STARTED, message, command, args);
        const ret = await command.exec(message, args);
        this.emit(types_1.CommandHandlerListeners.COMMAND_FINISHED, message, command, args, ret);
    }
    async parseCommand(message) {
        let prefixes = intoArray(await intoCallable(this.prefix)(message));
        const allowMention = await intoCallable(this.prefix)(message);
        if (allowMention) {
            const mentions = [
                `@${this.client.user.name?.toLocaleLowerCase()}`,
                `@${this.client.user.jid.replace(/@s.whatsapp.net/g, '')}`,
            ];
            prefixes = [...mentions, ...prefixes];
        }
        prefixes.sort(prefixCompare);
        return await this.parseMultiplePrefixes(message, prefixes.map((p) => [p, null]));
    }
    async parseMultiplePrefixes(message, pairs) {
        const parses = await Promise.all(pairs.map(async ([prefix, cmds]) => await this.parseWithPrefix(message, prefix, cmds)));
        const result = parses.find((parsed) => parsed?.command);
        if (result) {
            return result;
        }
        const guess = parses.find((parsed) => parsed?.prefix != null);
        if (guess) {
            return guess;
        }
        return {};
    }
    async parseWithPrefix(message, prefix, associatedCommands = null) {
        const msg = message.messages.first.message;
        if (!msg)
            return;
        const messageContent = msg.imageMessage?.caption ||
            msg.videoMessage?.caption ||
            msg.extendedTextMessage?.text ||
            msg.conversation ||
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
        const id = this.fromJid(message);
        if (reason != null) {
            this.emit(types_1.CommandHandlerListeners.MESSAGE_BLOCKED, message, reason);
        }
        else if (this.blockClient && id === this.client.user.jid) {
            this.emit(types_1.CommandHandlerListeners.MESSAGE_BLOCKED, message, 'Client');
        }
        else {
            return false;
        }
        return true;
    }
    async runPostTypeInhibitors(message, command) {
        const id = this.fromJid(message);
        const { botOwner, allowDM, allowGroups, groupAdmin, groupOwner } = command.filters;
        const { participant } = message.messages.first;
        if (botOwner) {
            const isOwner = this.client.isOwner(id);
            if (!isOwner) {
                this.emit(types_1.CommandHandlerListeners.COMMAND_BLOCKED, message, command, 'Owner only');
                return true;
            }
        }
        if (!allowGroups && message.jid.endsWith('@g.us')) {
            this.emit(types_1.CommandHandlerListeners.COMMAND_BLOCKED, message, command, 'Group message');
            return true;
        }
        if (allowGroups && (groupAdmin || groupOwner)) {
            if (message.jid.endsWith('@g.us')) {
                const group = await this.client.groupMetadata(message.jid);
                const { isAdmin, isSuperAdmin } = group.participants.find((u) => u.jid == participant);
                if (groupAdmin && !isAdmin) {
                    this.emit(types_1.CommandHandlerListeners.COMMAND_BLOCKED, message, command, 'Group admin only');
                    return true;
                }
                if (groupOwner && !isSuperAdmin) {
                    this.emit(types_1.CommandHandlerListeners.COMMAND_BLOCKED, message, command, 'Group owner only');
                    return true;
                }
            }
            else {
                if (groupAdmin) {
                    this.emit(types_1.CommandHandlerListeners.COMMAND_BLOCKED, message, command, 'Group admin only');
                    return true;
                }
                if (groupOwner) {
                    this.emit(types_1.CommandHandlerListeners.COMMAND_BLOCKED, message, command, 'Group owner only');
                    return true;
                }
            }
        }
        if (!allowDM && !message.jid.endsWith('@g.us')) {
            this.emit(types_1.CommandHandlerListeners.COMMAND_BLOCKED, message, command, 'Private message');
            return true;
        }
        const reason = this.inhibitorHandler
            ? await this.inhibitorHandler.test('post', message, command)
            : null;
        if (reason != null) {
            this.emit(types_1.CommandHandlerListeners.COMMAND_BLOCKED, message, command, reason);
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
            this.emit(types_1.CommandHandlerListeners.MESSAGE_BLOCKED, message, reason);
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
        return await this.parseMultiplePrefixes(message, pairs);
    }
    useInhibitorHandler(inhibitorHandler) {
        this.inhibitorHandler = inhibitorHandler;
        return this;
    }
    emitError(err, message, command) {
        if (this.listenerCount(types_1.CommandHandlerListeners.COMMAND_ERROR)) {
            this.emit(types_1.CommandHandlerListeners.COMMAND_ERROR, err, message, command);
            return;
        }
        throw err;
    }
    fromJid(message) {
        return /@s.whatsapp.net/g.test(message.jid) ? message.jid : message.messages.first.participant;
    }
}
exports.CommandHandler = CommandHandler;
exports.default = CommandHandler;
