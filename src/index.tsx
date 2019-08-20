import * as React from 'react';
import * as ReactDom from 'react-dom';

import App from './components/App/App';
import './style.css';

export const GlobalStateContext = React.createContext<{ [key: string]: any }>({});
export const FetchContext = React.createContext<{ [key: string]: {} }>({});

ReactDom.render(
  <React.Suspense fallback={<span>Loading...</span>}>
    <FetchContext.Provider value={{}}>
      <GlobalStateContext.Provider value={{}}>
        <App />
      </GlobalStateContext.Provider>
    </FetchContext.Provider>
  </React.Suspense>,
  document.getElementById('root')
);
