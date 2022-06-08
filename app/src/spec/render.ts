import { render as originalRender, RenderResult } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createI18n } from 'vue-i18n';

import { AppAbility, casl } from '~/ability';
import { apolloClient } from '~/apollo';
import { formkit } from '~/formkit';
import { pinia } from '~/pinia';
import { router } from '~/router';

export function render(component: any): RenderResult {
  const ability = new AppAbility([{ action: 'manage', subject: 'all' }]);
  return originalRender(component, {
    global: {
      plugins: [
        [casl, ability],
        createI18n({
          legacy: false,
          fallbackWarn: false,
          missingWarn: false,
        }),
        formkit,
        pinia,
        router,
      ],
      provide: { [DefaultApolloClient]: apolloClient },
    },
    props: { competencyId: 'cuid', frameworkId: 'ciud' },
  });
}
