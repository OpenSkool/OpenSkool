export function castArray<T>(value: T | T[]): T[] {
	return Array.isArray(value) ? value : [value];
}

export function chance(percentage = 50): boolean {
	const MAX_CHANCE_PERCENTAGE = 100;
	return random(MAX_CHANCE_PERCENTAGE) < percentage;
}

export function first<T>(array: T[]): T | undefined {
	const itemZero = array[0];
	return itemZero == null ? undefined : itemZero;
}

export function random(max = 1): number {
	return Math.floor(Math.random() * (max + 1));
}

export function times<T>(count: number, factory: (index: number) => T): T[] {
	const results: T[] = [];
	for (let index = 0; index < count; index += 1) {
		const item = factory(index);
		results.push(item);
	}
	return results;
}
