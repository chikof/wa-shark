"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const SharkModule_1 = require("../SharkModule");
const util_1 = require("../../util");
class Command extends SharkModule_1.SharkModule {
    aliases;
    allowDM;
    allowGroups;
    prefix;
    ownerOnly;
    cooldown;
    ratelimit;
    ignoreCooldown;
    description;
    constructor(id, options) {
        super(id, { category: options.category });
        this.aliases = options.alias || [];
        this.ownerOnly = Boolean(options.ownerOnly || false);
        this.cooldown = options.cooldown;
        this.ratelimit = options.ratelimit;
        this.prefix = options.prefix;
        this.description = options.description;
        this.allowDM = typeof options.allowDM == 'boolean' ? options.allowDM : true;
        this.allowGroups = typeof options.allowGroups == 'boolean' ? options.allowGroups : true;
    }
    async exec(message, args) {
        throw new util_1.SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
    }
}
exports.Command = Command;
exports.default = Command;
