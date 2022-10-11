declare module 'colorjs.io' {
	export default class Color {
		constructor(
			space: string,
			coordinates?: [number, number, number],
			alpha?: number,
		);

		// public inGamut(space?: string): boolean;

		public to(space: string): Color;

		public toGamut(): this;

		// public toString(options?: { inGamut: boolean }): string;

		// public alpha: number;

		public coords: number[];
	}
}
