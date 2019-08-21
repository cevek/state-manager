import * as React from 'react';
import { extractState } from 'remotedev';
import { GlobalContextType } from '../../types/store';
import { devUtils } from '../../utils/devUtils';

export const GlobalStateContext = React.createContext<GlobalContextType>({
  store: {},
  listeners: new Map(),
});

type Props = {
  children?: JSX.Element;
  value: GlobalContextType;
};

export default function GlobalStateProvider({ value, children }: Props) {
  React.useEffect(() => {
    devUtils.subscribe(message => {
      if (message.type !== 'DISPATCH') {
        return;
      }
      value.store = extractState(message);

      for (let listenerSet of value.listeners.values()) {
        listenerSet.forEach(listener => listener());
      }
    });
  }, [value]);

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}
