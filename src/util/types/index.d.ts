import { EventEmitter } from 'events';

export type LoadPredicate = (filepath?: string) => boolean;

export interface SharkModuleOptions {
  category?: string;
}

export interface SharkHandlerOptions extends SharkModuleOptions {
  automateCategories?: boolean;
  classToHandle?: any;
  directory?: string;
  extensions?: string[] | Set<string>;
  loadFilter?: LoadPredicate;
}

export interface ListenerOptions extends SharkModuleOptions {
  emitter: string | EventEmitter;
  event: string;
  type?: string;
}
