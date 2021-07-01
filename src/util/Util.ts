export class Util {
  static isPromise(value: any) {
    return value && typeof value.then === 'function' && typeof value.catch === 'function';
  }

  static isEventEmitter(value: any) {
    return value && typeof value.on === 'function' && typeof value.emit === 'function';
  }

  static prefixCompare(aKey: string, bKey: string | any[]) {
    if (aKey === '' && bKey === '') return 0;
    if (aKey === '') return 1;
    if (bKey === '') return -1;
    if (typeof aKey === 'function' && typeof bKey === 'function') return 0;
    if (typeof aKey === 'function') return 1;
    if (typeof bKey === 'function') return -1;
    return aKey.length === bKey.length
      ? aKey.localeCompare(typeof bKey == 'string' ? bKey : bKey[0])
      : bKey.length - aKey.length;
  }

  static intoArray(x: any) {
    if (Array.isArray(x)) {
      return x;
    }

    return [x];
  }

  static intoCallable(thing: any) {
    if (typeof thing === 'function') {
      return thing;
    }

    return () => thing;
  }

  static flatMap(xs: any, f: (arg0: any) => any) {
    const res = [];
    for (const x of xs) {
      res.push(...f(x));
    }

    return res;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static deepAssign(o1: any, ...os: object[]) {
    for (const o of os) {
      for (const [k, v] of Object.entries(o)) {
        const vIsObject = v && typeof v === 'object';
        const o1kIsObject =
          Object.prototype.hasOwnProperty.call(o1, k) && o1[k] && typeof o1[k] === 'object';
        if (vIsObject && o1kIsObject) {
          Util.deepAssign(o1[k], v);
        } else {
          o1[k] = v;
        }
      }
    }

    return o1;
  }

  static choice(...xs: any[]) {
    for (const x of xs) {
      if (x != null) {
        return x;
      }
    }

    return null;
  }
}

export default Util;
