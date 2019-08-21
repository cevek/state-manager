import * as React from 'react';
import First from '../First/First';
import Second from '../Second/Second';
import { GlobalStore } from '../../types/store';
import GlobalStateContextPatcher from '../GlobalStateContextPatcher/GlobalStateContextPatcher';

export const GlobalStateContext = React.createContext<GlobalStore>({});
export const FetchContext = React.createContext<{ [key: string]: {} }>({});

export default function Application() {
  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <FetchContext.Provider value={{}}>
        <GlobalStateContext.Provider value={{}}>
          <GlobalStateContextPatcher>
            <div>
              <First />
              <Second />
            </div>
          </GlobalStateContextPatcher>
        </GlobalStateContext.Provider>
      </FetchContext.Provider>
    </React.Suspense>
  );
}
