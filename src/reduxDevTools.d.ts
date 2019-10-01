declare const __REDUX_DEVTOOLS_EXTENSION__:
    | {
          connect(): {
              init(param: object): void;
              send(actionObject: { type: string; payload?: unknown }, newData: {}): void;
              subscribe(func: (param: { type: string; state: string }) => void): void;
              unsubscribe(): void;
          };
      }
    | undefined;
