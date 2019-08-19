import * as React from 'react';
import { Context } from '../index';
import { connectViaExtension } from 'remotedev';

export const remoteDev = connectViaExtension();
remoteDev.init({});

type StoreSlice<T> = {
  store: T;
  listeners: Set<() => void>;
};

type StoreSliceHook<T> = [T, (newState: T) => void]

function factory<T>(key: string, defaultValue: T): () => StoreSliceHook<T> {
  return function(): StoreSliceHook<T> {
    const [, setState] = React.useState(0);
    const context = React.useContext(Context) as {
      [key: string]: StoreSlice<T>;
    };

    let storeSlice = context[key];

    if (!storeSlice) {
      storeSlice = {
        store: defaultValue,
        listeners: new Set(),
      };

      context[key] = storeSlice;
      remoteDev.send(
        { type: `${key}_INIT`, data: storeSlice },
        { ...context, [key]: storeSlice }
      );
    }

    React.useEffect(() => {
      const listeners = context[key].listeners;
      const listener = () => {
        setState(prevValue => prevValue + 1);
      };
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);

    const updateState = (newState: T): void => {
      context[key] = {
        store: newState,
        listeners: context[key].listeners,
      };
      remoteDev.send(
        { type: `${key}_UPDATE`, data: context[key] },
        { ...context, [key]: context[key] }
      );
      context[key].listeners.forEach(fn => fn());
    };

    return [storeSlice.store, updateState];
  };
}

export const useFirst = factory('First', { a: 1 });
export const useSecond = factory('Second', { b: 2 });
