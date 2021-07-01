"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const Collection_1 = require("./Collection");
class Category extends Collection_1.Collection {
    id;
    constructor(id, iterable) {
        super(iterable);
        this.id = id;
    }
    reloadAll() {
        for (const m of Array.from(this.values())) {
            if (m.filepath)
                m.reload();
        }
        return this;
    }
    removeAll() {
        for (const m of Array.from(this.values())) {
            if (m.filepath)
                m.remove();
        }
        return this;
    }
    toString() {
        return this.id;
    }
}
exports.Category = Category;
exports.default = Category;
