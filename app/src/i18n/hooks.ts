import { GLOBAL_LOCALES_GLOB } from './constants';
import { useI18nStore } from './store';

export function useInitI18n(): void {
  const i18nStore = useI18nStore();
  i18nStore.loadGlob(GLOBAL_LOCALES_GLOB);
}
