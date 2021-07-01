import { WAConnection } from '@adiwajshing/baileys';

import { EventEmitter } from 'events';
import { dirname, sep, extname, resolve, join } from 'path';
import { readdirSync, statSync } from 'fs';

import { Category, Collection, SharkError } from '../util';
import { SharkModule } from './SharkModule';
import { LoadPredicate, SharkHandlerOptions } from '../util/types';

export class SharkHandler extends EventEmitter {
  public client: WAConnection;
  public directory: string;
  public classToHandle: SharkModule;
  public extensions: Set<unknown>;
  public automateCategories: boolean;
  public loadfilter: () => boolean;
  public modules: Collection<string, any>;
  public categories: Collection<any, any>;

  constructor(client: WAConnection, options?: SharkHandlerOptions) {
    super();

    this.client = client;

    this.directory = options.directory;

    this.classToHandle = options.classToHandle;

    this.extensions = new Set(options.extensions);

    this.automateCategories = Boolean(options.automateCategories);

    this.loadfilter = options.loadFilter;

    this.modules = new Collection();

    this.categories = new Collection();
  }

  public register(module: SharkModule, filePath?: string) {
    module.filepath = filePath;
    module.client = this.client;
    module.handler = this;
    this.modules.set(module.id, module);

    if (module.categoryID === 'default' && this.automateCategories) {
      const dirs = dirname(filePath).split(sep);
      module.categoryID = dirs[dirs.length - 1];
    }

    if (!this.categories.has(module.categoryID)) {
      this.categories.set(module.categoryID, new Category(module.categoryID));
    }

    const category = this.categories.get(module.categoryID);
    module.category = category;
    category.set(module.id, module);
  }

  public deregister(module: SharkModule) {
    if (module.filepath) delete require.cache[require.resolve(module.filepath)];

    this.modules.delete(module.id);
    module.category.set(module.id, null);
  }

  public load(thing: string, isReload = false) {
    const isClass = typeof thing === 'function';
    if (!isClass && !this.extensions.has(extname(thing))) return undefined;

    let mod = isClass
      ? thing
      : function findExport(m: { prototype: any; default: any }) {
          if (!m) return null;
          if (m.prototype instanceof this.classToHandle) return m;
          return m.default ? findExport.call(this, m.default) : null;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
        }.call(this, require(thing));

    if (mod && mod.prototype instanceof (this.classToHandle as any)) {
      mod = new mod(this);
    } else {
      if (!isClass) delete require.cache[require.resolve(thing)];
      return undefined;
    }

    if (this.modules.has(mod.id))
      throw new SharkError('ALREADY_LOADED', this.classToHandle.constructor.name, mod.id);

    this.register(mod, isClass ? null : thing);
    this.emit('eventLoaded', mod, isReload);
    return mod;
  }

  public loadAll(
    directory: string = this.directory,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter: LoadPredicate = this.loadfilter || ((file?: string) => true),
  ) {
    const filepaths = this.readdirRecursive(directory);
    for (let filepath of filepaths) {
      filepath = resolve(filepath);
      if (filter(filepath)) {
        this.load(filepath);
      }
    }

    return this;
  }

  public remove(id: string) {
    const mod = this.modules.get(id.toString());
    if (!mod) throw new SharkError('MODULE_NOT_FOUND', this.classToHandle.constructor.name, id);

    this.deregister(mod);

    this.emit('removed', mod);
    return mod;
  }

  public removeAll() {
    for (const m of Array.from(this.modules.values())) {
      if (m.filepath) this.remove(m.id);
    }

    return this;
  }

  public reload(id: string) {
    const mod = this.modules.get(id.toString());
    if (!mod) throw new SharkError('MODULE_NOT_FOUND', this.classToHandle.constructor.name, id);
    if (!mod.filepath)
      throw new SharkError('NOT_RELOADABLE', this.classToHandle.constructor.name, id);

    this.deregister(mod);

    const filepath = mod.filepath;
    const newMod = this.load(filepath, true);
    return newMod;
  }

  public reloadAll() {
    for (const m of Array.from(this.modules.values())) {
      if (m.filepath) this.reload(m.id);
    }

    return this;
  }

  public findCategory(name: string) {
    return this.categories.find((category: Category) => {
      return category.id.toLowerCase() === name.toLowerCase();
    });
  }

  private readdirRecursive(directory: string) {
    const result = [];

    (function read(dir) {
      const files = readdirSync(dir);

      for (const file of files) {
        const filepath = join(dir, file);

        if (statSync(filepath).isDirectory()) {
          read(filepath);
        } else {
          result.push(filepath);
        }
      }
    })(directory);

    return result;
  }
}

export default SharkHandler;
