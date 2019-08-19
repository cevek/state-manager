type A = {
  <T, A, B extends any[]>(cb: (a: A, ...args: B) => T): (...args: B) => T;
};

declare function bind<T, A, B extends any[]>(
  cb: (a: A, ...args: B) => T
): (...args: B) => T;

const newFunc = bind(function func(a: number, b: string, c: boolean) {
  return 1;
});

const result = newFunc('dfsdf', true);

type Foo = {
  a: number;
  b: string[];
  c: {
    e: string;
  };
};

type U<T> = { [P in keyof T]: T[P] extends number ? P : never }[keyof T];
type W<T> = Pick<T, U<T>>;
type GG = W<Foo>;

// type ValueOf<T> =T[keyof T];
type ValueOf<T> = { readonly [P in keyof T]?: T[P] };
type G<T> = { [P in keyof T]?: string };

type E<T> = { [P in keyof T]?: E<T[P]> };
type Q = E<Foo>;

type advFunc = {
  q: string,
  solve(): void;
}

