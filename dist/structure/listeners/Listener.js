"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
const SharkModule_1 = require("../SharkModule");
const util_1 = require("../../util");
class Listener extends SharkModule_1.SharkModule {
    emitter;
    event;
    type;
    constructor(id, options) {
        super(id, { category: options.category });
        this.emitter = options.emitter || 'client';
        this.event = options.event || id;
        this.type = options.type || 'on';
    }
    async exec(...args) {
        throw new util_1.SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
    }
}
exports.Listener = Listener;
exports.default = Listener;
