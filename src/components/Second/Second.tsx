import * as React from 'react';
import { useFirst, useSecond } from '../../hooks/globalState';

export default function Second() {
  const [firstState, setFirstState] = useFirst();
  const [secondState, setSecondState] = useSecond();

  return (
    <div style={{ display: 'flex' }}>
      <button onClick={() => setFirstState(null)}>make first null</button>
      <h1>{JSON.stringify(firstState)}</h1>
      <button onClick={() => setSecondState(null)}>make second null</button>
      <h1>{JSON.stringify(secondState)}</h1>
      <button
        onClick={() => {
          setFirstState(null);
          setSecondState(null);
        }}
      >
        make all null
      </button>
    </div>
  );
}
