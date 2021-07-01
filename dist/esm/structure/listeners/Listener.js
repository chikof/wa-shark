import { SharkModule } from '../SharkModule';
import { SharkError } from '../../util';
export class Listener extends SharkModule {
    emitter;
    event;
    type;
    constructor(id, options) {
        super(id, { category: options.category });
        this.emitter = options.emitter;
        this.event = options.event || id;
        this.type = options.type || 'on';
    }
    async exec(...args) {
        throw new SharkError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
    }
}
