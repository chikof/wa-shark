"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharkModule = void 0;
const SharkHandler_1 = __importDefault(require("./SharkHandler"));
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
        this.handler = new SharkHandler_1.default(this.client, {});
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
