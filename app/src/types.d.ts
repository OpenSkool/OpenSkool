import type { DefineComponent } from 'vue';

export type AnyComponent = DefineComponent<
	Record<string, unknown>,
	Record<string, unknown>,
	any // eslint-disable-line @typescript-eslint/no-explicit-any
>;
