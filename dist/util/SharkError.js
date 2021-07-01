"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharkError = void 0;
const Messages = {
    FILE_NOT_FOUND: (filename) => `File '${filename}' not found`,
    MODULE_NOT_FOUND: (constructor, id) => `${constructor} '${id}' does not exist`,
    ALREADY_LOADED: (constructor, id) => `${constructor} '${id}' is already loaded`,
    NOT_RELOADABLE: (constructor, id) => `${constructor} '${id}' is not reloadable`,
    INVALID_CLASS_TO_HANDLE: (given, expected) => `Class to handle ${given} is not a subclass of ${expected}`,
    ALIAS_CONFLICT: (alias, id, conflict) => `Alias '${alias}' of '${id}' already exists on '${conflict}'`,
    NOT_INSTANTIABLE: (constructor) => `${constructor} is not instantiable`,
    NOT_IMPLEMENTED: (constructor, method) => `${constructor}#${method} has not been implemented`,
    INVALID_TYPE: (name, expected, vowel = false) => `Value of '${name}' was not ${vowel ? 'an' : 'a'} ${expected}`,
};
class SharkError extends Error {
    code;
    constructor(key, ...args) {
        if (Messages[key] == null)
            throw new TypeError(`Error key '${key}' does not exist`);
        const message = Messages[key](...args);
        super(message);
        this.code = key;
    }
    get name() {
        return `SharkError [${this.code}]`;
    }
}
exports.SharkError = SharkError;
exports.default = SharkError;
