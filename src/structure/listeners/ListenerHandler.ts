import { EventEmitter } from 'events';

import { Collection, SharkError, Util } from '../../util';
import { SharkHandlerOptions } from '../../util/types';
import SharkClient from '../SharkClient';
import { SharkHandler } from '../SharkHandler';
import { Listener } from './Listener';

const { isEventEmitter } = Util;

export class ListenerHandler extends SharkHandler {
  public emitters: Collection<string, EventEmitter>;
  public declare modules: Collection<string, Listener>;

  constructor(client: SharkClient, options?: SharkHandlerOptions) {
    super(client, {
      directory: options.directory,
      classToHandle: options.classToHandle || Listener,
      extensions: options.extensions || ['.js', '.ts'],
      automateCategories: options.automateCategories,
      loadFilter: options.loadFilter,
    });

    this.emitters = new Collection();

    this.modules = new Collection();

    this.emitters.set('client', this.client);
  }

  public register(listener: Listener, filepath: string) {
    super.register(listener, filepath);
    listener.exec = listener.exec.bind(listener);
    this.addToEmitter(listener.id);
    return listener;
  }

  public deregister(listener: Listener) {
    this.removeFromEmitter(listener.id);
    super.deregister(listener);
  }

  public addToEmitter(id: string) {
    const listener = this.modules.get(id.toString());
    if (!listener) {
      throw new SharkError('MODULE_NOT_FOUND', this.classToHandle.constructor.name, id);
    }

    const emitter = isEventEmitter(listener.emitter)
      ? (listener.emitter as EventEmitter)
      : this.emitters.get(listener.emitter as string);

    if (!isEventEmitter(emitter)) {
      throw new SharkError('INVALID_TYPE', 'emitter', 'EventEmitter', true);
    }

    if (listener.type === 'once') {
      emitter.once(listener.event, listener.exec);
      return listener;
    }

    emitter.on(listener.event, listener.exec);
    return listener;
  }

  public removeFromEmitter(id: string) {
    const listener = this.modules.get(id.toString());
    if (!listener) {
      throw new SharkError('MODULE_NOT_FOUND', this.classToHandle.constructor.name, id);
    }

    const emitter = isEventEmitter(listener.emitter)
      ? (listener.emitter as EventEmitter)
      : this.emitters.get(listener.emitter as string);

    if (!isEventEmitter(emitter)) {
      throw new SharkError('INVALID_TYPE', 'emitter', 'EventEmitter', true);
    }

    emitter.removeListener(listener.event, listener.exec);
    return listener;
  }

  public setEmitters(emitters: { [x: string]: EventEmitter }) {
    for (const [key, value] of Object.entries(emitters)) {
      if (!isEventEmitter(value)) throw new SharkError('INVALID_TYPE', key, 'EventEmitter', true);
      this.emitters.set(key, value);
    }

    return this;
  }
}
