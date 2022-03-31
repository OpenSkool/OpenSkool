import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './app.vue';
import { formkit } from './formkit';
import { i18n, initI18n } from './i18n';
import { router } from './router';

import 'the-new-css-reset/css/reset.css';
import 'virtual:windi.css';

(async (): Promise<void> => {
  await initI18n();

  createApp(App)
    .use(formkit)
    .use(i18n)
    .use(createPinia())
    .use(router)
    .mount('#app');
})();
