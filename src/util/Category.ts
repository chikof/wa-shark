import SharkModule from '../structure/SharkModule';
import { Collection } from './Collection';

/**
 * A group of modules.
 * @param {string} id - ID of the category.
 * @param {Iterable} [iterable] - Entries to set.
 * @extends {Collection}
 */
export class Category extends Collection<string, SharkModule> {
  id: string;
  constructor(id: string, iterable?: Iterable<any>) {
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
  public reloadAll(): Category {
    for (const m of Array.from(this.values())) {
      if (m.filepath) m.reload();
    }

    return this;
  }

  /**
   * Calls `remove()` on all items in this category.
   * @returns {Category}
   */
  public removeAll(): Category {
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
