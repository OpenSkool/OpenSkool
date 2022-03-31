import { Loader } from './types';

export const AVAILABLE_LOCALES = ['en', 'nl'] as const;

export const DEFAULT_LOCALE = 'en';

export const GLOBAL_LOCALES_GLOB: Record<string, Loader> = import.meta.glob(
  '../locales/global.*.yaml',
);
