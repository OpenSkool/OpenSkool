export function assert(value: unknown, label = 'value'): asserts value {
  if (value == null) {
    throw new TypeError(`expected ${label} not to be nullish`);
  }
}

export function camelCase(string: string): string {
  const match = string.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g,
  );
  assert(match);
  const titleCaseString = match
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
    .join('');
  return `${titleCaseString.slice(0, 1).toLowerCase()}${titleCaseString.slice(
    1,
  )}`;
}
