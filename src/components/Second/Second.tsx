import * as React from 'react';
import { useFirst, useSecond } from '../../hooks/globalState';

export default function Second() {
  const [firstState] = useFirst();
  const [secondState, setSecondState] = useSecond();

  return (
    <div style={{ display: 'flex' }}>
      <h1>first {JSON.stringify(firstState)}</h1>
      <button onClick={() => setSecondState(null)}>
        make second null
      </button>
      <h1>second {JSON.stringify(secondState)}</h1>
    </div>
  );
}
