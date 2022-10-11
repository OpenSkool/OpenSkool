import Keyv, { type Store } from 'keyv';
import QuickLRU from 'quick-lru';

const lru = new QuickLRU<string, string | undefined>({ maxSize: 1000 });
const keyv = new Keyv({ store: lru as Store<string | undefined> });

export async function cacheFakeData<T>(
	key: string,
	getData: () => T | Promise<T>,
): Promise<T> {
	if (await keyv.has(key)) {
		return JSON.parse((await keyv.get(key)) as string) as T;
	}
	const data = getData();
	await keyv.set(key, JSON.stringify(data));
	return data;
}
