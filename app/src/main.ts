import { createApp } from 'vue';

import { AppAbility, AppRawRule, casl } from './ability';
import App from './app.vue';
import { initAuth } from './auth';
import { formkit } from './formkit';
import { i18n, i18nService } from './i18n';
import { pinia } from './pinia';
import { router } from './router';

import 'the-new-css-reset/css/reset.css';
import 'virtual:windi.css';

(async (): Promise<void> => {
  const auth = await initAuth();
  await i18nService.initI18n();

  createApp(App)
    .use(casl, new AppAbility(auth.abilityRules as AppRawRule[]))
    .use(formkit)
    .use(i18n)
    .use(pinia)
    .use(router)
    .mount('#app');
})();
