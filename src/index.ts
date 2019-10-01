import * as React from 'react';

type KeyData = {
    listeners: Listener;
    dependantsList: Set<string>;
};
type ContextType<T = unknown> = {
    store: { [key: string]: T };
    keyData: Map<string, KeyData>;
};

type Listener = Set<() => void>;

type Global<T> = {
    key: string;
    validate: (val: T) => T;
    defaultValue: T;
};

let counter = 0;
const Globals = new Map<string, Global<any>>();

const call = (callback: () => void) => callback();
const noop = () => {};
function setStateInvariant() {
    throw new Error('You cannot update state inside validate');
}

const devUtils =
    typeof __REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? __REDUX_DEVTOOLS_EXTENSION__.connect() : undefined;
type Current = { context: ContextType; dependantKey: string };
let current: Current | undefined;

const StateContext = React.createContext<ContextType>({
    store: {},
    keyData: new Map(),
});

type Props = {
    children?: React.ReactNode;
    value?: { [key: string]: unknown };
};

export function StateProvider({ value, children }: Props) {
    const [state] = React.useState<ContextType>({
        store: {},
        keyData: new Map(),
    });
    const context: ContextType = value ? { store: value, keyData: state.keyData } : state;

    if (devUtils !== undefined) {
        React.useEffect(() => {
            devUtils.init(context.store);
            devUtils.subscribe(message => {
                if (message.type !== 'DISPATCH') {
                    return;
                }
                context.store = message;

                for (let [, keyData] of context.keyData) {
                    keyData.listeners.forEach(listener => listener());
                }
            });
            return () => {
                devUtils.unsubscribe();
            };
        }, [context]);
    }

    return React.createElement(StateContext.Provider, { value: context, children });
}

export function createNullableState<T>(
    key: string,
    validate?: (newValue: T | undefined) => T | undefined,
    defaultValue?: T,
) {
    return createState<T | undefined>(key, defaultValue, validate) as () => [
        T | undefined,
        (value: T | undefined) => void,
        () => void,
    ];
}

export function createState<T>(
    key: string,
    defaultValue: T,
    validate: (newValue: T) => T = v => v,
): () => [T, (value: T) => void, (value: T) => void] {
    const defaultVal = defaultValue!;
    const glob: Global<T> = { key: key, validate: validate, defaultValue: defaultVal };
    Globals.set(key, glob);
    return () => {
        if (current !== undefined) {
            if (current === undefined) throw new Error('Never');
            const context = current.context as ContextType<T>;
            const { dependantsList } = getOrCreate(context.keyData, key, keyDataDefaultFactory);
            const keyExits = Object.hasOwnProperty.call(context.store, key);
            const returnValue = keyExits
                ? context.store[key]
                : callInContext({ dependantKey: key, context }, validate, defaultVal);

            dependantsList.add(current.dependantKey);
            return [returnValue, setStateInvariant, setStateInvariant];
        }
        const [, setState] = React.useState(0);
        const forceUpdate = React.useCallback(() => setState(++counter), []);
        const context = React.useContext(StateContext) as ContextType<T>;

        const { listeners } = getOrCreate(context.keyData, key, keyDataDefaultFactory);
        const updateState = React.useCallback((state: T) => setGlobalState(context, key, state), [context]);

        const { store } = context;
        const keyExits = Object.hasOwnProperty.call(store, key);

        React.useEffect(() => {
            listeners.add(forceUpdate);
            return () => {
                listeners.delete(forceUpdate);
            };
        }, [listeners, forceUpdate]);

        const returnValue = keyExits ? store[key] : callInContext({ dependantKey: key, context }, validate, defaultVal);
        return [returnValue, updateState, updateState];
    };
}

function setGlobalState<T>(context: ContextType, key: string, newSt: T) {
    const { validate, defaultValue } = Globals.get(key) as Global<T>;
    const { listeners, dependantsList } = getOrCreate(context.keyData, key, keyDataDefaultFactory);
    const newState = callInContext({ dependantKey: key, context }, validate, newSt);
    if (newState === context.store[key]) {
        return;
    }

    context.store = {
        ...context.store,
        [key]: newState,
    };

    listeners.forEach(call);
    if (devUtils !== undefined) {
        devUtils.send({ type: key, payload: newState }, context.store);
    }
    dependantsList.forEach(dKey => {
        const hasDKey = Object.hasOwnProperty.call(context.store, dKey);
        const dState = hasDKey ? context.store[dKey] : defaultValue;
        setGlobalState(context, dKey, dState);
    });
}

function callInContext<T>(newCurrent: Current, validate: (val: T) => T, val: T): T {
    const prevCurrent = current;
    current = newCurrent;
    try {
        return validate(val);
    } finally {
        current = prevCurrent;
    }
}

function keyDataDefaultFactory(): KeyData {
    return {
        listeners: new Set(),
        dependantsList: new Set(),
    };
}

function getOrCreate<K, V>(map: Map<K, V>, key: K, insert: () => V & {}) {
    if (map.has(key)) {
        const val = map.get(key);
        if (val === undefined) throw new Error('never');
        return val;
    }
    const newVal = insert();
    map.set(key, newVal);
    return newVal;
}

// function createContextIfEmpty<T>(context: ContextType, key: string, calc: (val: T) => T, defaultValue: T) {
//     if (!Object.hasOwnProperty.call(context.store, key)) {
//         context.store[key] = callInContext({ dependantKey: key, context }, calc, defaultValue);
//     }
//     return getOrCreate(context.keyData, key, keyDataDefaultFactory);
// }
