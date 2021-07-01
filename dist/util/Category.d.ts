import SharkModule from '../structure/SharkModule';
import { Collection } from './Collection';
export declare class Category extends Collection<string, SharkModule> {
    id: string;
    constructor(id: string, iterable?: Iterable<any>);
    reloadAll(): Category;
    removeAll(): Category;
    toString(): string;
}
export default Category;
