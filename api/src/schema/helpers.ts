import Keyv, { type Store } from 'keyv';
import QuickLRU from 'quick-lru';

const lru = new QuickLRU({ maxSize: 1000 });
const keyv = new Keyv({ store: lru as Store<unknown> });

export async function cacheFakeData<T>(
  key: string,
  getData: () => T | Promise<T>,
): Promise<T> {
  if (await keyv.has(key)) {
    return (await keyv.get(key)) as T;
  }
  const data = getData();
  await keyv.set(key, data);
  return data;
}
