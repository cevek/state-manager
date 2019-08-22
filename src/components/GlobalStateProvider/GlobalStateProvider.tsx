import * as React from 'react';
import { extractState } from 'remotedev';
import { GlobalContextType, Listener } from '../../types/store';
import { devUtils } from '../../utils/devUtils';

export const GlobalStateContext = React.createContext<GlobalContextType>({
  store: {},
  listeners: new Map(),
});

type Props = {
  children?: JSX.Element;
  value: { [key: string]: unknown };
};

export default function GlobalStateProvider({ value, children }: Props) {
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

      for (let listenerSet of context.listeners.values()) {
        listenerSet.forEach(listener => listener());
      }
    });
    return () => {
      devUtils.unsubscribe();
    };
  }, [context]);

  return (
    <GlobalStateContext.Provider value={context}>
      {children}
    </GlobalStateContext.Provider>
  );
}
