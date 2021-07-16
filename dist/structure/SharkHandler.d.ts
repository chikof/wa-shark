/// <reference types="node" />
import { EventEmitter } from 'events';
import { SharkModule } from './SharkModule';
import SharkClient from './SharkClient';
import { Collection } from '../util';
import { LoadPredicate, SharkHandlerOptions } from '../util/types';
export declare class SharkHandler extends EventEmitter {
    client: SharkClient;
    directory: string;
    classToHandle: SharkModule;
    extensions: Set<unknown>;
    automateCategories: boolean;
    loadfilter: () => boolean;
    modules: Collection<string, any>;
    categories: Collection<any, any>;
    constructor(client: SharkClient, options?: SharkHandlerOptions | {
        [x: string]: any;
    });
    register(module: SharkModule, filePath?: string): void;
    deregister(module: SharkModule): void;
    load(thing: string, isReload?: boolean): any;
    loadAll(directory?: string, filter?: LoadPredicate): this;
    remove(id: string): any;
    removeAll(): this;
    reload(id: string): any;
    reloadAll(): this;
    findCategory(name: string): any;
    private readdirRecursive;
}
export default SharkHandler;
