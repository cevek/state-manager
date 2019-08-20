import * as React from 'react';
import { GlobalStateContext } from '../index';
import { connectViaExtension } from 'remotedev';
import { useForceUpdate } from './useForceUpdate';

export const remoteDev = connectViaExtension();
remoteDev.init({});

type StoreSliceHook<T> = [T, (newState: T) => void];
type Listeners = Map<string, Set<() => void>>;

export const globalListeners = new Map<{}, Listeners>();

function factory<T>(sliceKey: string, defaultValue?: T) {
  return function(): StoreSliceHook<T> {
    const forceUpdate = useForceUpdate();
    const context = React.useContext(GlobalStateContext);

    if (!globalListeners.has(context)) {
      globalListeners.set(context, new Map() as Listeners);
    }

    const globalStoreListeners = globalListeners.get(context);

    if (!globalStoreListeners) {
      throw new Error('no globalStoreListeners');
    }

    if (!Object.prototype.hasOwnProperty.call(context, sliceKey)) {
      context[sliceKey] = defaultValue;
      remoteDev.send(
        { type: `${sliceKey}_INIT`, payload: defaultValue },
        {
          ...context,
          [sliceKey]: defaultValue,
        }
      );

      globalStoreListeners.set(sliceKey, new Set());
    }

    const listeners = globalStoreListeners.get(sliceKey);

    if (!listeners) {
      throw new Error('no listeners');
    }

    React.useEffect(() => {
      listeners.add(forceUpdate);
      return () => {
        listeners.delete(forceUpdate);
      };
    }, []);

    const updateState = (newState: T) => {
      if (newState === context[sliceKey]) {
        return;
      }
      context[sliceKey] = newState;
      listeners.forEach(fn => fn());
      remoteDev.send(
        { type: `${sliceKey}_UPDATE`, payload: newState },
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
