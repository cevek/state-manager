import * as React from 'react';
import First from '../First/First';
import Second from '../Second/Second';
import GlobalStateProvider from '../GlobalStateProvider/GlobalStateProvider';

export const FetchContext = React.createContext<{ [key: string]: {} }>({});

export default function Application() {
  const [fetchDataState] = React.useState({});
  const [globalState] = React.useState({ first: 9, second: { b: 9 } });

  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <FetchContext.Provider value={fetchDataState}>
        <GlobalStateProvider value={globalState}>
          <div>
            <First />
            <Second />
          </div>
        </GlobalStateProvider>
      </FetchContext.Provider>
    </React.Suspense>
  );
}
