export function sample<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Can not sample empty array');
  }
  return array[Math.round(Math.random() * array.length)];
}
