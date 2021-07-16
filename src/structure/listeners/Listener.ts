import { EventEmitter } from 'events';

import { SharkModule } from '../SharkModule';
import { SharkError } from '../../util';
import { ListenerOptions } from '../../util/types';

export class Listener extends SharkModule {
  public emitter: string | EventEmitter;
  public event: string;
  public type: string;

  constructor(id: string, options: ListenerOptions) {
    super(id, { category: options.category });

    this.emitter = options.emitter;

    this.event = options.event || id;

    this.type = options.type || 'on';
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async exec(...args: any[]): Promise<any> {
    throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
  }
}

export default Listener;
