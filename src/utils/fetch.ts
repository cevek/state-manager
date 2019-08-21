import * as React from 'react';
import { FetchContext } from '../components/Application/Application';

export default function fetchData(url: string, ms: number) {
  const ctx = React.useContext(FetchContext);
  if (ctx[url]) {
    return ctx[url];
  }
  const promise = fakeFetch(url, ms);
  promise.then(data => {
    ctx[url] = data;
  });
  throw promise;
}

function fakeFetch(url: string, ms: number) {
  return new Promise<number>(resolve =>
    setTimeout(() => resolve(Math.random()), ms)
  );
}
