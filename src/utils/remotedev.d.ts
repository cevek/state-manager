declare module 'remotedev' {
  export function connectViaExtension(): {
    init(param: object): void;
    send(actionObject: {type: string, payload?: {}}, newData: {}): void;
    subscribe(func: (param: {type: string}) => void): void;
  };
  export function extractState(obj: object): { [key: string]: unknown };
}
