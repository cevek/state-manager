export {};
declare global {
  interface Window {
    __PRELOADED_FETCH_STATE__: { [key: string]: unknown };
    __PRELOADED_STATE__: { [key: string]: unknown };
  }
}
