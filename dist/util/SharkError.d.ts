declare type options = 'FILE_NOT_FOUND' | 'MODULE_NOT_FOUND' | 'ALREADY_LOADED' | 'NOT_RELOADABLE' | 'INVALID_CLASS_TO_HANDLE' | 'ALIAS_CONFLICT' | 'NOT_INSTANTIABLE' | 'NOT_IMPLEMENTED' | 'INVALID_TYPE';
export declare class SharkError extends Error {
    code: string | number;
    constructor(key: options, ...args: any[]);
    get name(): string;
}
export default SharkError;
