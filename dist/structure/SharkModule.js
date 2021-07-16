"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharkModule = void 0;
const SharkHandler_1 = require("./SharkHandler");
class SharkModule {
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
        this.handler = new SharkHandler_1.SharkHandler(this.client);
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
exports.SharkModule = SharkModule;
exports.default = SharkModule;
