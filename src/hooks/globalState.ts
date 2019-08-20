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

    if (!globalListeners.has(context)) {
      globalListeners.set(context, new Map<string, Listener>());
    }

    const globalStoreListeners = globalListeners.get(context);

    if (!globalStoreListeners) {
      throw new Error('no globalStoreListeners');
    }

    if (!globalStoreListeners.has(sliceKey)) {
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
