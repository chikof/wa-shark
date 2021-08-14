import { SharkClient } from './SharkClient';
import { SharkHandler } from './SharkHandler';
import { Category } from '../util';
import { SharkModuleOptions } from '../util/types';
export declare class SharkModule {
    id: string;
    categoryID: string;
    category: Category<string, SharkModule>;
    filepath: string;
    client: SharkClient;
    handler: SharkHandler;
    constructor(id: string, options?: SharkModuleOptions);
    reload(): any;
    remove(): SharkModule;
    toString(): string;
}
export default SharkModule;
