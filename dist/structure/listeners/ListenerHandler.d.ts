/// <reference types="node" />
import { EventEmitter } from 'events';
import { SharkClient } from '../SharkClient';
import { SharkHandler } from '../SharkHandler';
import { Listener } from './Listener';
import { Category, Collection } from '../../util';
import { SharkHandlerOptions } from '../../util/types';
export declare class ListenerHandler extends SharkHandler {
    emitters: Collection<string, EventEmitter>;
    modules: Collection<string, Listener>;
    categories: Collection<string, Category<string, Listener>>;
    constructor(client: SharkClient, options?: SharkHandlerOptions);
    register(listener: Listener, filepath: string): Listener;
    deregister(listener: Listener): void;
    addToEmitter(id: string): Listener;
    removeFromEmitter(id: string): Listener;
    setEmitters(emitters: {
        [x: string]: EventEmitter;
    }): this;
}
export default ListenerHandler;
