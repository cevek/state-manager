import * as React from 'react';
import First from '../First/First';
import Second from '../Second/Second';
import GlobalStateProvider from '../GlobalStateProvider/GlobalStateProvider';
import { FetchContext } from '../../utils/fetch';

const __PRELOADED_FETCH_STATE__ = {};
const __PRELOADED_STATE__ = { first: 9, second: { b: 9 } };

export default function Application() {
  return (
    <React.Suspense fallback={<span>Loading...</span>}>
      <FetchContext.Provider value={__PRELOADED_FETCH_STATE__}>
        <GlobalStateProvider value={__PRELOADED_STATE__}>
          <div>
            <First />
            <Second />
          </div>
        </GlobalStateProvider>
      </FetchContext.Provider>
    </React.Suspense>
  );
}
