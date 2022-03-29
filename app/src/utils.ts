export function assert(value: unknown): asserts value {
  if (value == null) {
    throw new TypeError('expected value not to be nullish');
  }
}

export function sample<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('Can not sample empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}
