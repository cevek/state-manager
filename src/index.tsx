import * as React from 'react';
import * as ReactDom from 'react-dom';

import App from './components/App/App';
import './style.css';

export const Context = React.createContext({});
export const FetchContext = React.createContext({} as { [key: string]: {} });

ReactDom.render(
  <React.Suspense fallback={<span>Loading...</span>}>
    <FetchContext.Provider value={{}}>
      <Context.Provider value={{}}>
        <App />
      </Context.Provider>
    </FetchContext.Provider>
  </React.Suspense>,
  document.getElementById('root')
);
