import { SharkClient } from './SharkClient';
import { SharkHandler } from './SharkHandler';

import { Category } from '../util';
import { SharkModuleOptions } from '../util/types';

export class SharkModule {
  public id: string;
  public categoryID: string;
  public category: Category<string, SharkModule>;
  public filepath: string;
  public client: SharkClient;
  public handler: SharkHandler;

  constructor(id: string, options?: SharkModuleOptions) {
    this.id = id;

    this.categoryID = options.category;
  }

  public reload() {
    return this.handler.reload(this.id);
  }

  public remove() {
    return this.handler.remove(this.id);
  }

  public toString() {
    return this.id;
  }
}

export default SharkModule;
