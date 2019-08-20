import * as React from 'react';
import First from '../First/First';
import Second from '../Second/Second';
import { GlobalStore } from '../../types/store';
import { extractState } from 'remotedev';
import { remoteDev } from '../../hooks/globalState';

export const GlobalStateContext = React.createContext<GlobalStore>({});
export const FetchContext = React.createContext<{ [key: string]: {} }>({});

export default function Application() {
  const [globalState, setGlobalState] = React.useState<GlobalStore>({});

  React.useEffect(() => {
    remoteDev.subscribe(message => {
      const recoveredState = extractState(message);
      if (message.type !== 'DISPATCH' || recoveredState === undefined) {
        return;
      }
      setGlobalState(recoveredState);
    });
  }, [globalState]);

  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <FetchContext.Provider value={{}}>
        <GlobalStateContext.Provider value={globalState}>
          <div>
            <First />
            <Second />
          </div>
        </GlobalStateContext.Provider>
      </FetchContext.Provider>
    </React.Suspense>
  );
}
