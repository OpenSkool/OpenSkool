export function logData(data: unknown): void {
	console.dir(data, { depth: Number.POSITIVE_INFINITY });
}
