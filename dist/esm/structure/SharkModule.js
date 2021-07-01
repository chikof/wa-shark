import SharkHandler from './SharkHandler';
export class SharkModule {
    id;
    categoryID;
    category;
    filepath;
    client;
    handler;
    constructor(id, options) {
        this.id = id;
        this.categoryID = options.category;
        this.category = null;
        this.filepath = null;
        this.client = null;
        this.handler = new SharkHandler(this.client, {});
    }
    reload() {
        return this.handler.reload(this.id);
    }
    remove() {
        return this.handler.remove(this.id);
    }
    toString() {
        return this.id;
    }
}
export default SharkModule;
