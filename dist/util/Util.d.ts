export declare class Util {
    static isPromise(value: any): boolean;
    static isEventEmitter(value: any): boolean;
    static prefixCompare(aKey: string, bKey: string | any[]): number;
    static intoArray(x: any): any[];
    static intoCallable(thing: any): any;
    static flatMap(xs: any, f: (arg0: any) => any): any[];
    static deepAssign(o1: any, ...os: object[]): any;
    static choice(...xs: any[]): any;
}
export default Util;
