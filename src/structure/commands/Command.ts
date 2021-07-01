import { WAChatUpdate } from '@adiwajshing/baileys';
import { SharkError } from '../../util';
import SharkModule from '../SharkModule';

declare interface CommandOptions {
  alias: string[];
  ownerOnly?: boolean;
  category?: string;
  cooldown?: number;
  ratelimit?: number;
  prefix?: string | string[];
  lock?: boolean;
  ignoreCooldown?: string | string[];
}

export class Command extends SharkModule {
  public aliases: string[] | [];
  public prefix: string | string[];
  public ownerOnly: boolean;
  public cooldown: number;
  public ratelimit: number;
  public lock: boolean;
  public ignoreCooldown: any;

  constructor(id: string, options: CommandOptions) {
    super(id, { category: options.category });

    this.aliases = options.alias || [];

    this.ownerOnly = Boolean(options.ownerOnly || false);

    this.cooldown = options.cooldown;

    this.ratelimit = options.ratelimit;

    this.prefix = options.prefix;

    this.lock = options.lock;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async exec(message: WAChatUpdate, args?: any): Promise<any> {
    throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
  }
}
export default Command;
