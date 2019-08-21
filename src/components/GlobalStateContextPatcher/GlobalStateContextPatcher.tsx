import * as React from 'react';
import { GlobalStateContext } from '../Application/Application';
import { globalListeners, remoteDev } from '../../hooks/globalState';
import { extractState } from 'remotedev';

type Props = {
  children?: JSX.Element;
};

export default function GlobalStateContextPatcher(props: Props) {
  const context = React.useContext(GlobalStateContext);

  React.useEffect(() => {
    remoteDev.subscribe(message => {
      const recoveredState = extractState(message);
      if (message.type !== 'DISPATCH' || recoveredState === undefined) {
        return;
      }

      for (let key of Object.keys(context)) {
        context[key] = recoveredState[key];
      }

      const allListeners = globalListeners.get(context);
      if (allListeners) {
        new Set<() => void>(...allListeners.values()).forEach(fn => fn());
      }
    });
  }, [context]);

  return <React.Fragment>{props.children}</React.Fragment>;
}
