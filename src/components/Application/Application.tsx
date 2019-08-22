import * as React from 'react';
import First from '../First/First';
import Second from '../Second/Second';
import GlobalStateProvider from '../GlobalStateProvider/GlobalStateProvider';
import { FetchContext } from '../../utils/fetch';

export default function Application() {
  const fetchData = React.useMemo(() => {
    return JSON.parse(window.__PRELOADED_FETCH_STATE__);
  }, [window.__PRELOADED_FETCH_STATE__]);

  const preloadedState = React.useMemo(() => {
    return JSON.parse(window.__PRELOADED_STATE__);
  }, [window.__PRELOADED_STATE__]);

  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <FetchContext.Provider value={fetchData}>
        <GlobalStateProvider value={preloadedState}>
          <div>
            <First />
            <Second />
          </div>
        </GlobalStateProvider>
      </FetchContext.Provider>
    </React.Suspense>
  );
}
