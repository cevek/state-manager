import * as React from 'react';
import { useFirst, useSecond } from '../../hooks/globalState';

export default function Second() {
  const [firstState, setFirstState] = useFirst();
  const [secondState, setSecondState] = useSecond();

  return (
    <div style={{ display: 'flex' }}>
      <button onClick={() => setFirstState(firstState + 2)}>
        change first
      </button>
      <h1>{JSON.stringify(firstState)}</h1>
      <button
        onClick={() => setSecondState({ ...secondState, b: secondState.b + 2 })}
      >
        change second
      </button>
      <h1>{JSON.stringify(secondState)}</h1>
      <button
        onClick={() => {
          setFirstState(firstState + 2);
          setSecondState({ ...secondState, b: secondState.b + 2 });
        }}
      >
        change all
      </button>
    </div>
  );
}
