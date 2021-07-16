import { SharkModule } from '../SharkModule';
import { SharkError } from '../../util';
export class Command extends SharkModule {
    aliases;
    allowDM;
    allowGroups;
    prefix;
    ownerOnly;
    cooldown;
    ratelimit;
    lock;
    ignoreCooldown;
    description;
    constructor(id, options) {
        super(id, { category: options.category });
        this.aliases = options.alias || [];
        this.ownerOnly = Boolean(options.ownerOnly || false);
        this.cooldown = options.cooldown;
        this.ratelimit = options.ratelimit;
        this.prefix = options.prefix;
        this.lock = options.lock;
        this.allowDM = typeof options.allowDM == 'boolean' ? options.allowDM : true;
        this.allowGroups = typeof options.allowGroups == 'boolean' ? options.allowGroups : true;
    }
    async exec(message, args) {
        throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
    }
}
export default Command;
