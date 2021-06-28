import { WAConnection } from '@adiwajshing/baileys';
import { Category, Collection } from '../util/';
import SharkHandler from './SharkHandler';

export interface ModuleOptions {
  category: string;
}

export class SharkModule {
  id: string;
  categoryID: string;
  category: Collection<string, Category>;
  filepath: string;
  client: WAConnection;
  handler: SharkHandler;

  constructor(id: string, options: ModuleOptions) {
    this.id = id;
    this.categoryID = options.category;
    this.category = null;
    this.filepath = null;
    this.client = null;
    this.handler = new SharkHandler(this.client);
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
