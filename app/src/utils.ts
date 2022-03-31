export function assert(value: unknown, label = 'value'): asserts value {
  if (value == null) {
    throw new TypeError(`expected ${label} not to be nullish`);
  }
}
