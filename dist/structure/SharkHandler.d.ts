/// <reference types="node" />
import { EventEmitter } from 'events';
import { SharkModule } from './SharkModule';
import SharkClient from './SharkClient';
import { Category, Collection } from '../util';
import { LoadPredicate, SharkHandlerOptions } from '../util/types';
export declare class SharkHandler extends EventEmitter {
    client: SharkClient;
    directory: string;
    classToHandle: typeof SharkModule;
    extensions: Set<unknown>;
    automateCategories: boolean;
    loadfilter: LoadPredicate;
    modules: Collection<string, SharkModule>;
    categories: Collection<string, Category<string, SharkModule>>;
    constructor(client: SharkClient, options?: SharkHandlerOptions);
    register(module: SharkModule, filePath?: string): void;
    deregister(module: SharkModule): void;
    load(thing: string, isReload?: boolean): any;
    loadAll(directory?: string, filter?: LoadPredicate): this;
    remove(id: string): SharkModule;
    removeAll(): this;
    reload(id: string): any;
    reloadAll(): this;
    findCategory(name: string): Category<string, SharkModule>;
    private readdirRecursive;
}
export default SharkHandler;
