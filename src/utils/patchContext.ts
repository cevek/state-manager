import { globalListeners } from '../hooks/globalState';
import { GlobalContextType } from '../types/store';

export default function patchContext(
  value: GlobalContextType,
  recoveredState:
    | { [key: string]: object | number | string | boolean | null }
    | undefined
) {
  value.store = recoveredState === undefined ? {} : recoveredState;

  const allListeners = globalListeners.get(value);
  if (allListeners) {
    new Set(...allListeners.values()).forEach(fn => fn());
  }
}
