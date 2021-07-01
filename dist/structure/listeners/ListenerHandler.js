"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerHandler = void 0;
const util_1 = require("../../util");
const SharkHandler_1 = require("../SharkHandler");
const Listener_1 = require("./Listener");
const { isEventEmitter } = util_1.Util;
class ListenerHandler extends SharkHandler_1.SharkHandler {
    emitters;
    constructor(client, options) {
        super(client, {
            directory: options.directory,
            classToHandle: options.classToHandle || Listener_1.Listener,
            extensions: options.extensions || ['.js', '.ts'],
            automateCategories: options.automateCategories,
            loadFilter: options.loadFilter,
        });
        this.emitters = new util_1.Collection();
        this.modules = new util_1.Collection();
        this.emitters.set('client', this.client);
    }
    register(listener, filepath) {
        super.register(listener, filepath);
        listener.exec = listener.exec.bind(listener);
        this.addToEmitter(listener.id);
        return listener;
    }
    deregister(listener) {
        this.removeFromEmitter(listener.id);
        super.deregister(listener);
    }
    addToEmitter(id) {
        const listener = this.modules.get(id.toString());
        if (!listener) {
            throw new util_1.SharkError('MODULE_NOT_FOUND', this.classToHandle.constructor.name, id);
        }
        const emitter = isEventEmitter(listener.emitter)
            ? listener.emitter
            : this.emitters.get(listener.emitter);
        if (!isEventEmitter(emitter)) {
            throw new util_1.SharkError('INVALID_TYPE', 'emitter', 'EventEmitter', true);
        }
        if (listener.type === 'once') {
            emitter.once(listener.event, listener.exec);
            return listener;
        }
        emitter.on(listener.event, listener.exec);
        return listener;
    }
    removeFromEmitter(id) {
        const listener = this.modules.get(id.toString());
        if (!listener) {
            throw new util_1.SharkError('MODULE_NOT_FOUND', this.classToHandle.constructor.name, id);
        }
        const emitter = isEventEmitter(listener.emitter)
            ? listener.emitter
            : this.emitters.get(listener.emitter);
        if (!isEventEmitter(emitter)) {
            throw new util_1.SharkError('INVALID_TYPE', 'emitter', 'EventEmitter', true);
        }
        emitter.removeListener(listener.event, listener.exec);
        return listener;
    }
    setEmitters(emitters) {
        for (const [key, value] of Object.entries(emitters)) {
            if (!isEventEmitter(value))
                throw new util_1.SharkError('INVALID_TYPE', key, 'EventEmitter', true);
            this.emitters.set(key, value);
        }
        return this;
    }
}
exports.ListenerHandler = ListenerHandler;
