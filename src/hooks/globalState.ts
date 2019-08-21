import * as React from 'react';
import { connectViaExtension } from 'remotedev';
import { useForceUpdate } from './useForceUpdate';
import { GlobalStoreSliceType, Listener } from '../types/store';
import { GlobalStateContext } from '../components/Application/Application';

export const remoteDev = connectViaExtension();
remoteDev.init({});

export const globalListeners = new Map<{}, Map<string, Listener>>();

function factory<T extends GlobalStoreSliceType>(
  sliceKey: string,
  defaultValue: T
) {
  return function() {
    const forceUpdate = useForceUpdate();
    const context = React.useContext(GlobalStateContext);

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

    React.useEffect(() => {
      listeners!.add(forceUpdate);
      return () => {
        listeners!.delete(forceUpdate);
      };
    }, []);

    const updateState = (newState: T) => {
      if (newState === context[sliceKey]) {
        return;
      }
      context[sliceKey] = newState;
      listeners!.forEach(fn => fn());
      remoteDev.send(
        { type: `${sliceKey}_UPDATE`, payload: newState },
        { ...context, [sliceKey]: newState }
      );
    };

    let returnValue = context[sliceKey];
    if (!Object.hasOwnProperty.call(context, sliceKey)) {
      returnValue = defaultValue;
    }

    return [returnValue, updateState] as const;
  };
}

export const useFirst = factory('first', 1);
export const useSecond = factory('second', { b: 2 });
