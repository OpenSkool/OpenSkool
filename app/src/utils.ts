export function assert(value: unknown, label = 'value'): asserts value {
  if (value == null) {
    throw new TypeError(`expected ${label} not to be nullish`);
  }
}

export function sample<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('Can not sample empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}
