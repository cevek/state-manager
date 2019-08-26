import factory from '../utils/hooksFactory';

export const useFirst = factory('first', 1);
export const useSecond = factory<{ [key: string]: number } | null>('second', {
  b: 1,
});
