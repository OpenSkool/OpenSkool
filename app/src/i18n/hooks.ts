import { GLOBAL_LOCALES_GLOB } from './constants';
import { I18nStore, useI18nStore } from './store';

export function useInitI18n(): I18nStore {
  const i18nStore = useI18nStore();
  i18nStore.loadGlob(GLOBAL_LOCALES_GLOB);
  return i18nStore;
}
