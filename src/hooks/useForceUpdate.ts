import * as React from 'react';

export function useForceUpdate() {
  const [, forceUpdate] = React.useState(0);
  return React.useCallback(() => forceUpdate(prevValue => prevValue + 1), []);
}