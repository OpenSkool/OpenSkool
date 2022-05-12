import { createApp } from 'vue';

import { AppAbility, AppRawRule, casl } from './ability';
import { initAuth } from './auth';
import { formkit } from './formkit';
import { i18n, i18nService } from './i18n';
import Main from './main.vue';
import { pinia } from './pinia';
import { router } from './router';

import 'the-new-css-reset/css/reset.css';
import 'virtual:windi.css';

(async (): Promise<void> => {
  const currentUser = await initAuth();
  const abilityRules: AppRawRule[] =
    currentUser == null ? [] : (currentUser.abilityRules as AppRawRule[]);

  await i18nService.initI18n();

  createApp(Main)
    .use(casl, new AppAbility(abilityRules))
    .use(formkit)
    .use(i18n)
    .use(pinia)
    .use(router)
    .mount('#app');
})();
