import { isRef, type Ref } from 'vue';

import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_STORAGE_LOCALE_KEY,
} from './constants';
import { i18n } from './plugin';

export function getLocaleString(): string {
  return isRef(i18n.global.locale)
    ? (i18n.global.locale as Ref<string>).value
    : i18n.global.locale;
}

export async function initI18n(): Promise<void> {
  const localeStorage = window.localStorage.getItem(LOCALE_STORAGE_LOCALE_KEY);
  const initialLocale =
    localeStorage == null || !AVAILABLE_LOCALES.includes(localeStorage)
      ? DEFAULT_LOCALE
      : localeStorage;
  setLocale(initialLocale);
}

export function mergeLocaleMessage(
  locale: string,
  namespace: string,
  messages: object,
): void {
  i18n.global.mergeLocaleMessage(locale, { [namespace]: messages });
}

export function setLocale(locale: string): void {
  const html = document.querySelector('html') as HTMLHtmlElement;
  html.setAttribute('lang', locale);
  i18n.global.locale.value = locale;
  window.localStorage.setItem(LOCALE_STORAGE_LOCALE_KEY, locale);
}
