import * as React from 'react';
import { remoteDev } from '../../hooks/globalState';
import { extractState } from 'remotedev';
import { GlobalContextType } from '../../types/store';
import patchContext from '../../utils/patchContext';

export const GlobalStateContext = React.createContext<GlobalContextType>({
  store: {},
});

type Props = {
  children?: JSX.Element;
  value: GlobalContextType;
};

export default function GlobalStateProvider(props: Props) {
  const { value } = props;

  React.useEffect(() => {
    remoteDev.subscribe(message => {
      patchContext(value, extractState(message));
    });
  }, [value]);

  return (
    <GlobalStateContext.Provider value={value}>
      {props.children}
    </GlobalStateContext.Provider>
  );
}
