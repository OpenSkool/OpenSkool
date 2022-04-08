export function first<T>(array: T[]): T | undefined {
  const itemZero = array[0];
  return itemZero == null ? undefined : itemZero;
}
