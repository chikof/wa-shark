"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InhibitorHandler = void 0;
const SharkHandler_1 = require("../SharkHandler");
const Inhibitor_1 = require("./Inhibitor");
const util_1 = require("../../util");
const { isPromise } = util_1.Util;
class InhibitorHandler extends SharkHandler_1.SharkHandler {
    constructor(client, options) {
        super(client, {
            directory: options.directory,
            classToHandle: options.classToHandle || Inhibitor_1.Inhibitor,
            extensions: options.extensions || ['.js', '.ts'],
            automateCategories: options.automateCategories,
            loadFilter: options.loadFilter,
        });
        this.classToHandle = options.classToHandle || Inhibitor_1.Inhibitor;
        if (options.classToHandle?.constructor?.prototype instanceof Inhibitor_1.Inhibitor ||
            this.classToHandle.constructor.prototype === Inhibitor_1.Inhibitor) {
            throw new util_1.SharkError('INVALID_CLASS_TO_HANDLE', this.classToHandle.constructor.name, Inhibitor_1.Inhibitor.name);
        }
    }
    async test(type, message, command) {
        if (!this.modules.size)
            return null;
        const inhibitors = this.modules.filter((i) => i.type === type);
        if (!inhibitors.size)
            return null;
        const promises = [];
        for (const inhibitor of inhibitors.values()) {
            promises.push((async () => {
                let inhibited = inhibitor.exec(message, command);
                if (isPromise(inhibited))
                    inhibited = await inhibited;
                if (inhibited)
                    return inhibitor;
                return null;
            })());
        }
        const inhibitedInhibitors = (await Promise.all(promises)).filter((r) => r);
        if (!inhibitedInhibitors.length)
            return null;
        inhibitedInhibitors.sort((a, b) => b.priority - a.priority);
        return inhibitedInhibitors[0].reason;
    }
}
exports.InhibitorHandler = InhibitorHandler;
exports.default = InhibitorHandler;
