export function sample<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('Can not sample empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}
