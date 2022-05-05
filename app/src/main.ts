import { createApp } from 'vue';

import { AppAbility, AppRawRule, casl } from './ability';
import App from './app.vue';
import { initAuth } from './auth';
import { formkit } from './formkit';
import { i18n, initI18n } from './i18n';
import { pinia } from './pinia';
import { router } from './router';

import 'the-new-css-reset/css/reset.css';
import 'virtual:windi.css';

(async (): Promise<void> => {
  const currentUser = await initAuth();
  const abilityRules: AppRawRule[] =
    currentUser == null ? [] : (currentUser.abilityRules as AppRawRule[]);

  await initI18n();

  createApp(App)
    .use(casl, new AppAbility(abilityRules))
    .use(formkit)
    .use(i18n)
    .use(pinia)
    .use(router)
    .mount('#app');
})();
