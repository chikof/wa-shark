import { SharkError } from '../../util';
import SharkModule from '../SharkModule';
export class Command extends SharkModule {
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
        throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
    }
}
export default Command;
