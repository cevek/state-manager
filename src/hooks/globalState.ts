import * as React from 'react';
import { connectViaExtension } from 'remotedev';
import { useForceUpdate } from './useForceUpdate';
import { GlobalContextType, Listener } from '../types/store';
import { GlobalStateContext } from '../components/GlobalStateProvider/GlobalStateProvider';

export const remoteDev = connectViaExtension();
remoteDev.init({});

export const globalListeners = new Map<
  GlobalContextType,
  Map<string, Listener>
>();

function factory<T>(sliceKey: string, defaultValue: T) {
  return function() {
    const forceUpdate = useForceUpdate();
    const context = React.useContext(GlobalStateContext) as {
      store: { [key: string]: T };
    };

    let globalStoreListeners = globalListeners.get(context);
    if (!globalStoreListeners) {
      globalStoreListeners = new Map();
      globalListeners.set(context, globalStoreListeners);
    }

    let listeners = globalStoreListeners.get(sliceKey);
    if (!listeners) {
      listeners = new Set();
      globalStoreListeners.set(sliceKey, listeners);
    }
    const sliceListeners = listeners;

    React.useEffect(() => {
      sliceListeners.add(forceUpdate);
      return () => {
        sliceListeners.delete(forceUpdate);
      };
    }, []);

    const updateState = (newState: T) => {
      if (newState === context.store[sliceKey] || newState === undefined) {
        return;
      }

      context.store = {
        ...context.store,
        [sliceKey]: newState,
      };

      sliceListeners.forEach(fn => fn());
      remoteDev.send(
        { type: `${sliceKey}_UPDATE`, payload: newState },
        context.store
      );
    };

    const { store } = context;

    let returnValue = store[sliceKey];
    if (!Object.hasOwnProperty.call(store, sliceKey)) {
      returnValue = defaultValue;
    }

    return [returnValue, updateState] as const;
  };
}

export const useFirst = factory('first', 1);
export const useSecond = factory<{ [key: string]: number } | null>('second', {
  b: 1,
});
