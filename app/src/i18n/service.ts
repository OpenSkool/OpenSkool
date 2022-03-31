import { isRef, Ref } from 'vue';

import { DEFAULT_LOCALE, GLOBAL_LOCALES_GLOB } from './constants';
import { parseLocalesGlob } from './helpers';
import { i18n } from './plugin';

export async function initI18n(): Promise<void> {
  setLocale(DEFAULT_LOCALE);
  for (const { locale, loader } of parseLocalesGlob(GLOBAL_LOCALES_GLOB)) {
    if (locale === DEFAULT_LOCALE) {
      const { default: messages } = await loader();
      mergeLocaleMessage(locale, 'global', messages);
    }
  }
}

export function mergeLocaleMessage(
  locale: string,
  namespace: string,
  messages: object,
): void {
  console.info(`🌐 "${namespace}" loaded (${locale})`);
  i18n.global.mergeLocaleMessage(locale, { [namespace]: messages });
}

export function setLocale(locale: string): void {
  const html = document.querySelector('html') as HTMLHtmlElement;
  html.setAttribute('lang', locale);
  if (isRef(i18n.global.locale)) {
    (i18n.global.locale as Ref<string>).value = locale;
  } else {
    i18n.global.locale = locale;
  }
}
