export type GlobalContextType<T = unknown> = {
  store: { [key: string]: T };
  listeners: Map<string, Listener>;
};

export type Listener = Set<() => void>;
