import { acceptHMRUpdate, defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';

import { parseLocalesGlob } from './helpers';
import { mergeLocaleMessage, setLocale } from './service';
import type { Loader } from './types';

export const useI18nStore = defineStore('i18n', () => {
  const i18n = useI18n();

  return {
    locale: i18n.locale,

    async loadGlob(globLoaderMap: Record<string, Loader>): Promise<void> {
      const parsedGlobEntries = parseLocalesGlob(globLoaderMap);
      for (const { loader, locale, namespace } of parsedGlobEntries) {
        const { default: messages } = await loader();
        mergeLocaleMessage(locale, namespace, messages);
      }
    },

    async setLocale(locale: string): Promise<void> {
      setLocale(locale);
    },
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useI18nStore, import.meta.hot));
}
