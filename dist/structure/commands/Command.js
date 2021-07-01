"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const util_1 = require("../../util");
const SharkModule_1 = __importDefault(require("../SharkModule"));
class Command extends SharkModule_1.default {
    aliases;
    prefix;
    ownerOnly;
    cooldown;
    ratelimit;
    lock;
    ignoreCooldown;
    constructor(id, options) {
        super(id, { category: options.category });
        this.aliases = options.alias || [];
        this.ownerOnly = Boolean(options.ownerOnly || false);
        this.cooldown = options.cooldown;
        this.ratelimit = options.ratelimit;
        this.prefix = options.prefix;
        this.lock = options.lock;
    }
    async exec(message, args) {
        throw new util_1.SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
    }
}
exports.Command = Command;
exports.default = Command;
