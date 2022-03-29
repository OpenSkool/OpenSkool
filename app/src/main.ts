import { createPinia } from 'pinia';
import routes from 'virtual:generated-pages';
import { createApp } from 'vue';
import type { Ref } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from 'vue-router';

import App from './app.vue';
import formkit from './formkit';

import 'the-new-css-reset/css/reset.css';
import 'virtual:windi.css';

const i18n = createI18n({
  fallbackLocale: 'en',
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve(async (to) => {
  if (to.path === '/') {
    const locale = 'en';
    (i18n.global.locale as unknown as Ref<string>).value = locale;
    const messages = await import('./locales/en.yaml');
    const html = document.querySelector('html') as HTMLHtmlElement;
    html.setAttribute('lang', locale);
    i18n.global.setLocaleMessage(locale, messages.default);
  }
});

createApp(App)
  .use(formkit)
  .use(i18n)
  .use(createPinia())
  .use(router)
  .mount('#app');
