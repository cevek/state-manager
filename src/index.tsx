import * as React from 'react';
import { connectViaExtension, extractState } from 'remotedev';

type ContextType<T = unknown> = {
    store: { [key: string]: T };
    listeners: Map<string, Listener>;
};

type Listener = Set<() => void>;

const devUtils = connectViaExtension();
let idx = 0;

const StateContext = React.createContext<ContextType>({
    store: {},
    listeners: new Map(),
});

type Props = {
    children?: JSX.Element | JSX.Element[];
    value?: { [key: string]: unknown };
};

export function StateProvider({ value, children }: Props) {
    const [state] = React.useState({
        store: {},
        listeners: new Map<string, Listener>(),
    });
    const context = value ? { store: value, listeners: state.listeners } : state;

    React.useEffect(() => {
        devUtils.init(context.store);
        devUtils.subscribe(message => {
            if (message.type !== 'DISPATCH') {
                return;
            }
            context.store = extractState(message);

            for (let [, listenerSet] of context.listeners) {
                listenerSet.forEach(listener => listener());
            }
        });
        return () => {
            devUtils.unsubscribe();
        };
    }, [context]);

    return <StateContext.Provider value={context}>{children}</StateContext.Provider>;
}

export function createState<T>(
    sliceKey: string,
): () => readonly [T | undefined, (newState: T | undefined) => void, () => void];
export function createState<T>(
    sliceKey: string,
    defaultValue: T,
): () => readonly [T, (newState: T) => void, (newState: T) => void];
export function createState<T>(sliceKey: string, defaultValue?: T) {
    return () => {
        const [, setState] = React.useState(0);
        const forceUpdate = () => setState(++idx);
        const context = React.useContext(StateContext) as ContextType<T>;

        let listeners = context.listeners.get(sliceKey);
        if (!listeners) {
            listeners = new Set();
            context.listeners.set(sliceKey, listeners);
        }
        const sliceListeners = listeners;

        React.useEffect(() => {
            sliceListeners.add(forceUpdate);
            return () => {
                sliceListeners.delete(forceUpdate);
            };
        }, [sliceListeners]);

        const updateState = React.useCallback((newState: T) => {
            if (newState === context.store[sliceKey]) {
                return;
            }

            context.store = {
                ...context.store,
                [sliceKey]: newState,
            };

            sliceListeners.forEach(fn => fn());
            devUtils.send({ type: `${sliceKey}`, payload: newState }, context.store);
        }, [context, sliceListeners]);

        const { store } = context;

        const returnValue = Object.hasOwnProperty.call(store, sliceKey) ? store[sliceKey] : defaultValue;

        return [returnValue, updateState, updateState] as const;
    };
}
