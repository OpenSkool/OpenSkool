import { DEFAULT_LOCALE } from './constants';
import { parseLocalesGlob } from './helpers';
import { getLocaleString, mergeLocaleMessage } from './service';
import { Loader } from './types';

const messageLoaders: {
  [namespace: string]: {
    [locale: string]: { isLoaded: boolean; loader: Loader };
  };
} = {};

export async function loadGlob(
  globLoaderMap: Record<string, Loader>,
): Promise<void> {
  const parsedGlobEntries = parseLocalesGlob(globLoaderMap);
  for (const { loader, locale, namespace } of parsedGlobEntries) {
    registerLoader(namespace, locale, loader);
  }
  await loadNecessaryLocales();
}

export async function loadGlobalMessages(): Promise<void> {
  await loadGlob(import.meta.glob('~/locales/global.*.yaml'));
}

async function loadNecessaryLocales(): Promise<void> {
  /* eslint-disable no-continue */
  const loadLocales = new Set([DEFAULT_LOCALE, getLocaleString()]);
  for (const [namespace, namespaceLocaleEntries] of Object.entries(
    messageLoaders,
  )) {
    for (const locale of loadLocales) {
      const namespaceLocale = namespaceLocaleEntries[locale];
      if (namespaceLocale == null) {
        console.warn(`🌐 "${namespace}" misses locale "${locale}"`);
        continue;
      }
      if (namespaceLocale.isLoaded) {
        continue;
      }
      const { default: messages } = await namespaceLocale.loader();
      if (messages == null) {
        throw new TypeError(
          `locale (${namespace}) should return a default export`,
        );
      }
      mergeLocaleMessage(locale, namespace, messages);
      namespaceLocale.isLoaded = true;
      console.info(`🌐 "${namespace}" loaded locale "${locale}"`);
    }
  }
}

function registerLoader(
  namespace: string,
  locale: string,
  loader: Loader,
): void {
  messageLoaders[namespace] ??= {};
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  messageLoaders[namespace]![locale] ??= { isLoaded: false, loader };
}
