export function castArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function first<T>(array: T[]): T | undefined {
  const itemZero = array[0];
  return itemZero == null ? undefined : itemZero;
}

export function once<P extends unknown[], R>(
  wrappedFunction: (...parameters: P) => R,
): (...parameters: P) => R {
  let result: R | undefined;
  return (...parameters: P): R => {
    result ??= wrappedFunction(...parameters);
    return result as R;
  };
}

export function random(max = 1): number {
  return Math.floor(Math.random() * max);
}

export function sample<T>(array: T[]): T {
  return array[random(array.length)] as T;
}

export function sampleMany<T>(count: number, array: T[]): T[] {
  const max = Math.min(count, array.length);
  const results = new Set<T>();
  while (results.size < max) {
    results.add(sample(array));
  }
  return Array.from(results);
}

export function times<T>(count: number, factory: (index: number) => T): T[] {
  const results: T[] = [];
  for (let index = 0; index < count; index += 1) {
    const item = factory(index);
    results.push(item);
  }
  return results;
}
