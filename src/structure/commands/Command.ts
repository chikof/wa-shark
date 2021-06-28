import { WAChatUpdate } from '@adiwajshing/baileys';
import { SharkError } from '../../util';
import SharkModule, { ModuleOptions } from '../SharkModule';

export class Command extends SharkModule {
  aliases: string | string[];
  prefix: string;
  constructor(id: string, options: ModuleOptions) {
    super(id, options);
    this.aliases = 'ss';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async exec(message: WAChatUpdate, args?: any) {
    throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
  }
}
export default Command;
