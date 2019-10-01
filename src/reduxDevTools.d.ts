declare function __REDUX_DEVTOOLS_EXTENSION__(): {
    init(param: object): void;
    send(actionObject: { type: string; payload?: unknown }, newData: {}): void;
    subscribe(func: (param: { type: string; state: string }) => void): void;
    unsubscribe(): void;
};
