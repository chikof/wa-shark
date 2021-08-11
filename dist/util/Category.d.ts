import SharkModule from '../structure/SharkModule';
import { Collection } from './Collection';
export declare class Category<K extends string, V extends SharkModule> extends Collection<K, V> {
    id: string;
    constructor(id: string, iterable?: Iterable<[K, V]>);
    reloadAll(): this;
    removeAll(): this;
    toString(): string;
}
export default Category;
