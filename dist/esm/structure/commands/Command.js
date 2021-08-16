import { SharkModule } from '../SharkModule';
import { SharkError } from '../../util';
export class Command extends SharkModule {
    aliases;
    prefix;
    cooldown;
    ratelimit;
    description;
    filters;
    constructor(id, options) {
        super(id, { category: options.category });
        const { allowDM, botOwner, allowGroups, groupAdmin, groupOwner, ignoreCooldown } = options?.filters;
        this.aliases = options.alias || [];
        this.cooldown = options.cooldown;
        this.ratelimit = options.ratelimit;
        this.prefix = options.prefix;
        this.description = options.description;
        this.filters = {
            allowDM: typeof allowDM == 'boolean' ? allowDM : true,
            allowGroups: typeof allowGroups == 'boolean' ? allowGroups : true,
            botOwner: typeof botOwner == 'boolean' ? botOwner : false,
            groupAdmin: typeof groupAdmin == 'boolean' ? groupAdmin : false,
            groupOwner: typeof groupOwner == 'boolean' ? groupOwner : false,
            ignoreCooldown: ignoreCooldown,
        };
    }
    async exec(message, args) {
        throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
    }
}
export default Command;
