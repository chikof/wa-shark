"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inhibitor = void 0;
const SharkModule_1 = require("../SharkModule");
const util_1 = require("../../util");
class Inhibitor extends SharkModule_1.SharkModule {
    reason;
    type;
    priority;
    constructor(id, options) {
        super(id, { category: options.category });
        this.reason = options.reason;
        this.type = options.type;
        this.priority = options.priority;
    }
    exec(message, command) {
        throw new util_1.SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
    }
}
exports.Inhibitor = Inhibitor;
exports.default = Inhibitor;
