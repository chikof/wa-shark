import { WAChatUpdate } from '@adiwajshing/baileys';

import { Command } from '../commands/Command';
import { SharkModule } from '../SharkModule';

import { InhibitorOptions } from '../../util/types';
import { SharkError } from '../../util';

export class Inhibitor extends SharkModule {
  public reason: string;
  public type: string;
  public priority: number;

  constructor(id: string, options?: InhibitorOptions) {
    super(id, { category: options.category });

    this.reason = options.reason;

    this.type = options.type;

    this.priority = options.priority;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public exec(message: WAChatUpdate, command?: Command): boolean | Promise<boolean> {
    throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
  }
}

export default Inhibitor;
