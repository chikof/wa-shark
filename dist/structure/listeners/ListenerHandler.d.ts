/// <reference types="node" />
import { WAConnection } from '@adiwajshing/baileys';
import { EventEmitter } from 'events';
import { Collection } from '../../util';
import { SharkHandlerOptions } from '../../util/types';
import { SharkHandler } from '../SharkHandler';
import { Listener } from './Listener';
export declare class ListenerHandler extends SharkHandler {
    emitters: Collection<string, EventEmitter>;
    modules: Collection<string, Listener>;
    constructor(client: WAConnection, options?: SharkHandlerOptions);
    register(listener: Listener, filepath: string): Listener;
    deregister(listener: Listener): void;
    addToEmitter(id: string): Listener;
    removeFromEmitter(id: string): Listener;
    setEmitters(emitters: {
        [x: string]: EventEmitter;
    }): this;
}
