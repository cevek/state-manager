declare module 'remotedev' {
  export function connectViaExtension(): {
    init(param: object): void;
    send(actionObject: { type: string; payload?: unknown }, newData: {}): void;
    subscribe(func: (param: { type: string }) => void): void;
  };
  export function extractState(obj: {
    type: string;
  }): { [key: string]: object | number | string | boolean | null } | undefined;
}
