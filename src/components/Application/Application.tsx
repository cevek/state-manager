import * as React from 'react';
import First from '../First/First';
import Second from '../Second/Second';
import GlobalStateProvider from '../GlobalStateProvider/GlobalStateProvider';
import { FetchContext } from '../../utils/fetch';

export default function Application() {
  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <FetchContext.Provider value={window.__PRELOADED_FETCH_STATE__}>
        <GlobalStateProvider value={window.__PRELOADED_STATE__}>
          <div>
            <First />
            <Second />
          </div>
        </GlobalStateProvider>
      </FetchContext.Provider>
    </React.Suspense>
  );
}
