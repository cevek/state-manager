export type GlobalStore = { [key: string]: GlobalStoreSliceType };
export type GlobalStoreSliceType = object | number | string | boolean | null;

export type Listener = Set<() => void>;
