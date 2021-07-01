const Messages = {
  // Module-related
  FILE_NOT_FOUND: (filename: string) => `File '${filename}' not found`,
  MODULE_NOT_FOUND: (constructor: string, id: string) => `${constructor} '${id}' does not exist`,
  ALREADY_LOADED: (constructor: string, id: string) => `${constructor} '${id}' is already loaded`,
  NOT_RELOADABLE: (constructor: string, id: string) => `${constructor} '${id}' is not reloadable`,
  INVALID_CLASS_TO_HANDLE: (given: string, expected: string) =>
    `Class to handle ${given} is not a subclass of ${expected}`,

  // Command-related
  ALIAS_CONFLICT: (alias: string, id: string, conflict: string) =>
    `Alias '${alias}' of '${id}' already exists on '${conflict}'`,

  // Generic errors
  NOT_INSTANTIABLE: (constructor: string) => `${constructor} is not instantiable`,
  NOT_IMPLEMENTED: (constructor: string, method: string) =>
    `${constructor}#${method} has not been implemented`,
  INVALID_TYPE: (name: string, expected: string, vowel = false) =>
    `Value of '${name}' was not ${vowel ? 'an' : 'a'} ${expected}`,
};

type options =
  | 'FILE_NOT_FOUND'
  | 'MODULE_NOT_FOUND'
  | 'ALREADY_LOADED'
  | 'NOT_RELOADABLE'
  | 'INVALID_CLASS_TO_HANDLE'
  | 'ALIAS_CONFLICT'
  | 'NOT_INSTANTIABLE'
  | 'NOT_IMPLEMENTED'
  | 'INVALID_TYPE';

export class SharkError extends Error {
  code: string | number;
  constructor(key: options, ...args: any[]) {
    if (Messages[key] == null) throw new TypeError(`Error key '${key}' does not exist`);
    const message = Messages[key as string](...args);

    super(message);
    this.code = key;
  }

  get name() {
    return `SharkError [${this.code}]`;
  }
}

export default SharkError;
