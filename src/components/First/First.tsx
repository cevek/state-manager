import * as React from 'react';
import { useFirst, useSecond } from '../../hooks/hooks';
import fetchData from '../../utils/fetch';

export default function First() {
  const [firstState, setFirstState] = useFirst();
  const [secondState, setSecondState] = useSecond();

  function updateFirst() {
    setFirstState({ ...firstState, a: firstState.a + 1 });
  }

  function updateSecond() {
    setSecondState({ ...secondState, b: secondState.b + 1 });
  }

  return (
    <div>
      <button onClick={updateFirst}>change first</button>
      <h1>{JSON.stringify(firstState)}</h1>
      <button onClick={updateSecond}>change second</button>
      <h1>{JSON.stringify(secondState)}</h1>
    </div>
  );
}
