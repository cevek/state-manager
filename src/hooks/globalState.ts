import * as React from 'react';
import { GlobalStateContext } from '../index';
import { connectViaExtension } from 'remotedev';
import { useForceUpdate } from './useForceUpdate';

export const remoteDev = connectViaExtension();
remoteDev.init({});

type StoreSliceHook<T> = [T, (newState: T) => void];
type Listeners = { [key: string]: Set<() => void> };

export const globalListeners = new Map<{}, Listeners>();

function factory<T>(sliceKey: string, defaultValue?: T) {
  return function(): StoreSliceHook<T> {
    const forceUpdateListener = useForceUpdate();
    const context = React.useContext(GlobalStateContext);

    if (!globalListeners.has(context)) {
      globalListeners.set(context, {} as Listeners);
    }

    const globalStoreListeners = globalListeners.get(context);

    if (!context.hasOwnProperty(sliceKey)) {
      context[sliceKey] = defaultValue;
      remoteDev.send(
        { type: `${sliceKey}_INIT`, data: defaultValue },
        {
          ...context,
          [sliceKey]: defaultValue,
        }
      );
      globalStoreListeners![sliceKey] = new Set();
    }

    const listeners = globalStoreListeners![sliceKey];

    React.useEffect(() => {
      listeners.add(forceUpdateListener);
      return () => {
        listeners.delete(forceUpdateListener);
      };
    }, []);

    const updateState = (newState: T) => {
      context[sliceKey] = newState;
      listeners.forEach(fn => fn());
      remoteDev.send(
        { type: `${sliceKey}_UPDATE`, data: newState },
        {
          ...context,
          [sliceKey]: newState,
        }
      );
    };

    return [context[sliceKey], updateState];
  };
}

export const useFirst = factory('first', 2);
export const useSecond = factory('second', { b: 2 });
