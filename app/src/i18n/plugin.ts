import { createI18n } from 'vue-i18n';

import { DEFAULT_LOCALE } from './constants';

export const i18n = createI18n({
	fallbackLocale: DEFAULT_LOCALE,
	legacy: false,
	locale: DEFAULT_LOCALE,
});
