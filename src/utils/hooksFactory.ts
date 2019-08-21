import * as React from 'react';
import { GlobalStateContext } from '../components/GlobalStateProvider/GlobalStateProvider';
import { GlobalContextType } from '../types/store';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { devUtils } from './devUtils';

export default function factory<T>(sliceKey: string, defaultValue: T) {
  return function() {
    const forceUpdate = useForceUpdate();

    const context = React.useContext(GlobalStateContext) as GlobalContextType<
      T
    >;

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
    }, []);

    const updateState = (newState: T) => {
      if (newState === undefined) {
        throw new TypeError(
          `GlobalStore[${sliceKey}] can't be set to undefined`
        );
      }

      if (newState === context.store[sliceKey]) {
        return;
      }

      context.store = {
        ...context.store,
        [sliceKey]: newState,
      };

      sliceListeners.forEach(fn => fn());
      devUtils.send(
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
