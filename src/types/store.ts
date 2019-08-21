export type GlobalContextType = {
  store: { [key: string]: unknown };
  listeners: Map<string, Listener>;
};

export type Listener = Set<() => void>;
