import { WAChatUpdate } from '@adiwajshing/baileys';

import { SharkModule } from '../SharkModule';

import { SharkError } from '../../util';
import { CommandOptions } from '../../util/types';

export class Command extends SharkModule {
  public aliases: string[] | [];
  public allowDM?: boolean;
  public allowGroups?: boolean;
  public prefix: string | string[];
  public ownerOnly: boolean;
  public cooldown: number;
  public ratelimit: number;
  public lock: boolean;
  public ignoreCooldown: any;
  public description: { [x: string]: any };

  constructor(id: string, options: CommandOptions) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async exec(message: WAChatUpdate, args?: any): Promise<any> {
    throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
  }
}
export default Command;
