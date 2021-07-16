import { SharkClient } from './SharkClient';
import { SharkHandler } from './SharkHandler';
import { Category, Collection } from '../util';
import { SharkModuleOptions } from '../util/types';
export declare class SharkModule {
    id: string;
    categoryID: string;
    category: Collection<string, Category>;
    filepath: string;
    client: SharkClient;
    handler: SharkHandler;
    constructor(id: string, options: SharkModuleOptions);
    reload(): any;
    remove(): any;
    toString(): string;
}
export default SharkModule;
