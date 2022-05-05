export function castArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function first<T>(array: T[]): T | undefined {
  const itemZero = array[0];
  return itemZero == null ? undefined : itemZero;
}
