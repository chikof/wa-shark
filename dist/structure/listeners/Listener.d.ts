/// <reference types="node" />
import { EventEmitter } from 'events';
import { SharkModule } from '../SharkModule';
import { ListenerOptions } from '../../util/types';
export declare class Listener extends SharkModule {
    emitter: string | EventEmitter;
    event: string;
    type: string;
    constructor(id: string, options?: ListenerOptions);
    exec(...args: any[]): Promise<any>;
}
