import * as React from 'react';
import First from '../First/First';
import Second from '../Second/Second';
import GlobalStateProvider from '../GlobalStateProvider/GlobalStateProvider';

export const FetchContext = React.createContext<{ [key: string]: {} }>({});

export default function Application() {
  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <FetchContext.Provider value={{}}>
        <GlobalStateProvider value={{ first: 9, second: { b: 9 } }}>
          <div>
            <First />
            <Second />
          </div>
        </GlobalStateProvider>
      </FetchContext.Provider>
    </React.Suspense>
  );
}
