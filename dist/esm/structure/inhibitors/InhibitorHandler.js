import { SharkHandler } from '../SharkHandler';
import { Inhibitor } from './Inhibitor';
import { SharkError, Util } from '../../util';
const { isPromise } = Util;
export class InhibitorHandler extends SharkHandler {
    constructor(client, options) {
        super(client, {
            directory: options.directory,
            classToHandle: options.classToHandle || Inhibitor,
            extensions: options.extensions || ['.js', '.ts'],
            automateCategories: options.automateCategories,
            loadFilter: options.loadFilter,
        });
        options.classToHandle = options.classToHandle || Inhibitor;
        this.classToHandle = options.classToHandle;
        if (options.classToHandle.constructor.prototype instanceof Inhibitor ||
            this.classToHandle.constructor.prototype === Inhibitor) {
            throw new SharkError('INVALID_CLASS_TO_HANDLE', this.classToHandle.constructor.name, Inhibitor.name);
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
export default InhibitorHandler;
