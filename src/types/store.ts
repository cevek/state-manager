export type GlobalContextType = { store: { [key: string]: unknown } };
export type Listener = Set<() => void>;
