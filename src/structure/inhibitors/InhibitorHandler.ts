import { WAChatUpdate } from '@adiwajshing/baileys';

import { Command } from '../commands/Command';
import { SharkClient } from '../SharkClient';
import { SharkHandler } from '../SharkHandler';
import { Inhibitor } from './Inhibitor';

import { Category, Collection, SharkError, Util } from '../../util';
import { SharkHandlerOptions } from '../../util/types';

const { isPromise } = Util;

export class InhibitorHandler extends SharkHandler {
  public declare categories: Collection<string, Category<string, Inhibitor>>;
  public declare modules: Collection<string, Inhibitor>;

  constructor(client: SharkClient, options?: SharkHandlerOptions) {
    super(client, {
      directory: options.directory,
      classToHandle: options.classToHandle || Inhibitor,
      extensions: options.extensions || ['.js', '.ts'],
      automateCategories: options.automateCategories,
      loadFilter: options.loadFilter,
    });

    this.classToHandle = options.classToHandle || Inhibitor;
    if (
      options.classToHandle?.constructor?.prototype instanceof Inhibitor ||
      this.classToHandle.constructor.prototype === Inhibitor
    ) {
      throw new SharkError(
        'INVALID_CLASS_TO_HANDLE',
        this.classToHandle.constructor.name,
        Inhibitor.name,
      );
    }
  }

  public async test(type: string, message: WAChatUpdate, command?: Command) {
    if (!this.modules.size) return null;

    const inhibitors = this.modules.filter((i) => i.type === type);

    if (!inhibitors.size) return null;

    const promises = [];

    for (const inhibitor of inhibitors.values()) {
      promises.push(
        (async () => {
          let inhibited = inhibitor.exec(message, command);
          if (isPromise(inhibited)) inhibited = await inhibited;
          if (inhibited) return inhibitor;
          return null;
        })(),
      );
    }

    const inhibitedInhibitors = (await Promise.all<Inhibitor>(promises)).filter((r) => r);
    if (!inhibitedInhibitors.length) return null;

    inhibitedInhibitors.sort((a, b) => b.priority - a.priority);
    return inhibitedInhibitors[0].reason;
  }
}

export default InhibitorHandler;
