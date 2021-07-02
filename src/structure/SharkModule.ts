import { Category, Collection } from '../util/';
import SharkClient from './SharkClient';
import SharkHandler from './SharkHandler';

declare interface ModuleOptions {
  category: string;
}

export class SharkModule {
  public id: string;
  public categoryID: string;
  public category: Collection<string, Category>;
  public filepath: string;
  public client: SharkClient;
  public handler: SharkHandler;

  constructor(id: string, options: ModuleOptions) {
    this.id = id;

    this.categoryID = options.category;

    this.category = null;

    this.filepath = null;

    this.client = null;

    this.handler = new SharkHandler(this.client, {});
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
