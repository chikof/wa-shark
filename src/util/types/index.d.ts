import { EventEmitter } from 'events';

export type LoadPredicate = (filepath?: string) => boolean;

export interface SharkHandlerOptions extends SharkModuleOptions {
  automateCategories?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  classToHandle?: any;
  directory?: string;
  extensions?: string[] | Set<string>;
  loadFilter?: LoadPredicate;
}

export interface SharkModuleOptions {
  category?: string;
}

export interface ListenerOptions extends SharkModuleOptions {
  emitter: string | EventEmitter;
  event: string;
  type?: string;
}
