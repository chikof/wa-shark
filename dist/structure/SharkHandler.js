"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharkHandler = void 0;
const events_1 = require("events");
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("../util");
class SharkHandler extends events_1.EventEmitter {
    client;
    directory;
    classToHandle;
    extensions;
    automateCategories;
    loadfilter;
    modules;
    categories;
    constructor(client, options) {
        super();
        this.client = client;
        this.directory = options.directory;
        this.classToHandle = options.classToHandle;
        this.extensions = new Set(options.extensions);
        this.automateCategories = Boolean(options.automateCategories);
        this.loadfilter = options.loadFilter;
        this.modules = new util_1.Collection();
        this.categories = new util_1.Collection();
    }
    register(module, filePath) {
        module.filepath = filePath;
        module.client = this.client;
        module.handler = this;
        this.modules.set(module.id, module);
        if (module.categoryID === 'default' && this.automateCategories) {
            const dirs = path_1.dirname(filePath).split(path_1.sep);
            module.categoryID = dirs[dirs.length - 1];
        }
        if (!this.categories.has(module.categoryID)) {
            this.categories.set(module.categoryID, new util_1.Category(module.categoryID));
        }
        const category = this.categories.get(module.categoryID);
        module.category = category;
        category.set(module.id, module);
    }
    deregister(module) {
        if (module.filepath)
            delete require.cache[require.resolve(module.filepath)];
        this.modules.delete(module.id);
        module.category.set(module.id, null);
    }
    load(thing, isReload = false) {
        const isClass = typeof thing === 'function';
        if (!isClass && !this.extensions.has(path_1.extname(thing)))
            return undefined;
        let mod = isClass
            ? thing
            : function findExport(m) {
                if (!m)
                    return null;
                if (m.prototype instanceof this.classToHandle)
                    return m;
                return m.default ? findExport.call(this, m.default) : null;
            }.call(this, require(thing));
        if (mod && mod.prototype instanceof this.classToHandle) {
            mod = new mod(this);
        }
        else {
            if (!isClass)
                delete require.cache[require.resolve(thing)];
            return undefined;
        }
        if (this.modules.has(mod.id))
            throw new util_1.SharkError('ALREADY_LOADED', this.classToHandle.constructor.name, mod.id);
        this.register(mod, isClass ? null : thing);
        this.emit('eventLoaded', mod, isReload);
        return mod;
    }
    loadAll(directory = this.directory, filter = this.loadfilter || ((file) => true)) {
        const filepaths = this.readdirRecursive(directory);
        for (let filepath of filepaths) {
            filepath = path_1.resolve(filepath);
            if (filter(filepath)) {
                this.load(filepath);
            }
        }
        return this;
    }
    remove(id) {
        const mod = this.modules.get(id.toString());
        if (!mod)
            throw new util_1.SharkError('MODULE_NOT_FOUND', this.classToHandle.constructor.name, id);
        this.deregister(mod);
        this.emit('removed', mod);
        return mod;
    }
    removeAll() {
        for (const m of Array.from(this.modules.values())) {
            if (m.filepath)
                this.remove(m.id);
        }
        return this;
    }
    reload(id) {
        const mod = this.modules.get(id.toString());
        if (!mod)
            throw new util_1.SharkError('MODULE_NOT_FOUND', this.classToHandle.constructor.name, id);
        if (!mod.filepath)
            throw new util_1.SharkError('NOT_RELOADABLE', this.classToHandle.constructor.name, id);
        this.deregister(mod);
        const filepath = mod.filepath;
        const newMod = this.load(filepath, true);
        return newMod;
    }
    reloadAll() {
        for (const m of Array.from(this.modules.values())) {
            if (m.filepath)
                this.reload(m.id);
        }
        return this;
    }
    findCategory(name) {
        return this.categories.find((category) => {
            return category.id.toLowerCase() === name.toLowerCase();
        });
    }
    readdirRecursive(directory) {
        const result = [];
        (function read(dir) {
            const files = fs_1.readdirSync(dir);
            for (const file of files) {
                const filepath = path_1.join(dir, file);
                if (fs_1.statSync(filepath).isDirectory()) {
                    read(filepath);
                }
                else {
                    result.push(filepath);
                }
            }
        })(directory);
        return result;
    }
}
exports.SharkHandler = SharkHandler;
exports.default = SharkHandler;
