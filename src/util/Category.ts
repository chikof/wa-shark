import SharkModule from '../structure/SharkModule';
import { Collection } from './Collection';

/**
 * A group of modules.
 * @param {string} id - ID of the category.
 * @param {Iterable} [iterable] - Entries to set.
 * @extends {Collection}
 */
export class Category<K extends string, V extends SharkModule> extends Collection<K, V> {
  public id: string;

  constructor(id: string, iterable?: Iterable<[K, V]>) {
    super(iterable);

    /**
     * ID of the category.
     * @type {string}
     */
    this.id = id;
  }

  /**
   * Calls `reload()` on all items in this category.
   * @returns {Category}
   */
  public reloadAll(): this {
    for (const m of Array.from(this.values())) {
      if (m.filepath) m.reload();
    }

    return this;
  }

  /**
   * Calls `remove()` on all items in this category.
   * @returns {Category}
   */
  public removeAll(): this {
    for (const m of Array.from(this.values())) {
      if (m.filepath) m.remove();
    }

    return this;
  }

  /**
   * Returns the ID.
   * @returns {string}
   */
  public toString(): string {
    return this.id;
  }
}

export default Category;
