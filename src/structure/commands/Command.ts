import { WAChatUpdate } from '@adiwajshing/baileys';

import { SharkModule } from '../SharkModule';

import { SharkError } from '../../util';
import { CommandOptions, IgnoreCheckPredicate } from '../../util/types';

export class Command extends SharkModule {
  public aliases: string[] | [];
  public prefix: string | string[];
  public cooldown: number;
  public ratelimit: number;
  public description: { [x: string]: any };
  public filters: {
    botOwner?: boolean;
    allowDM?: boolean;
    allowGroups?: boolean;
    ignoreCooldown?: string | string[] | IgnoreCheckPredicate;
    groupAdmin?: boolean;
    groupOwner?: boolean;
  };

  constructor(id: string, options: CommandOptions) {
    super(id, { category: options.category });

    const { allowDM, botOwner, allowGroups, groupAdmin, groupOwner, ignoreCooldown } =
      options.filters || {};

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async exec(message: WAChatUpdate, args?: any): Promise<any> {
    throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
  }
}
export default Command;
