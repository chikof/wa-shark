import { Category, Collection } from '../util/';
import SharkClient from './SharkClient';
import SharkHandler from './SharkHandler';
declare interface ModuleOptions {
    category: string;
}
export declare class SharkModule {
    id: string;
    categoryID: string;
    category: Collection<string, Category>;
    filepath: string;
    client: SharkClient;
    handler: SharkHandler;
    constructor(id: string, options: ModuleOptions);
    reload(): any;
    remove(): any;
    toString(): string;
}
export default SharkModule;
