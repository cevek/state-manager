import * as React from 'react';
import First from '../First/First';
import Second from '../Second/Second';
import { extractState } from 'remotedev';
import { globalListeners, remoteDev } from '../../hooks/globalState';
import { GlobalStateContext } from '../../index';

export default function App() {
  const context = React.useContext(GlobalStateContext);

  React.useEffect(() => {
    remoteDev.subscribe(message => {
      const recoveredState = extractState(message);
      if (message.type !== 'DISPATCH' && typeof recoveredState !== 'object') {
        return;
      }

      for (let key of Object.keys(context)) {
        context[key] = recoveredState[key];
      }

      const allListeners = globalListeners.get(context);
      if (allListeners) {
        new Set(...allListeners.values()).forEach(fn => fn());
      }
    });
  }, [context]);

  return (
    <div>
      <First />
      <Second />
    </div>
  );
}
