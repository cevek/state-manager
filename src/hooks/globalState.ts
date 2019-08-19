import * as React from 'react';

import { Context } from '../index';
import { connectViaExtension, extractState } from 'remotedev';

export const remoteDev = connectViaExtension();

type StoreSliceHook<T> = [T, (newState: T) => void];

const initialGlobalState = {} as { [key: string]: any };

function factory<T>(
  sliceKey: string,
  defaultValue: T
): () => StoreSliceHook<T> {
  initialGlobalState[sliceKey] = defaultValue;
  return function() {
    const [, forceUpdate] = React.useState(0);
    const context = React.useContext(Context);

    if (!context.has(context)) {
      context.set(context, {});
    }

    if (!context.has(sliceKey)) {
      context.set(sliceKey, defaultValue);
      context.get(context)[sliceKey] = new Set();
    }

    React.useEffect(() => {
      const listeners = context.get(context)[sliceKey];
      const listener = () => {
        forceUpdate(prevValue => prevValue + 1);
      };
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);

    React.useEffect(() => {
      remoteDev.subscribe(message => {
        const recoveredState = extractState(message) as { [key: string]: any };
        if (typeof recoveredState !== 'object') {
          return;
        }
        const listeners = context.get(context);
        context.clear();
        Object.keys(recoveredState).forEach((key: string) => {
          context.set(key, recoveredState[key]);
        });
        context.set(context, listeners);
        context.get(context)[sliceKey].forEach((fn: () => void) => fn());
      });
    }, []);

    const updateState = (newState: T): void => {
      context.set(sliceKey, newState);
      context.get(context)[sliceKey].forEach((fn: () => void) => fn());
      logSend(newState, sliceKey, context);
    };

    return [context.get(sliceKey), updateState];
  };
}

export function logSend(
  newState: any,
  sliceKey: string,
  previousState: Map<any, any>
) {
  remoteDev.send(
    { type: `${sliceKey}_UPDATE`, data: newState },
    {
      ...toDebuggableObject(previousState),
      [sliceKey]: newState,
    }
  );
}

function toDebuggableObject(rawMap: Map<any, any>) {
  return Array.from(rawMap.keys()).reduce((acc, cur) => {
    if (cur !== Object(cur)) {
      acc[cur] = rawMap.get(cur);
    }
    return acc;
  }, {});
}

export const useFirst = factory('first', 2);
export const useSecond = factory('second', { b: 2 });

remoteDev.init(initialGlobalState);
