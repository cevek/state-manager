declare module 'remotedev' {
  export function connectViaExtension(): {
    init(param: object): void;
    send(actionObject: object, newData: object): void;
    subscribe(func: (param: object) => void): void;
  };
  export function extractState(obj: object): object;
}
