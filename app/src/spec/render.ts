import { render as originalRender, RenderResult } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createI18n } from 'vue-i18n';

import { apolloClient } from '~/api';
import { formkit } from '~/formkit';
import { pinia } from '~/pinia';
import { router } from '~/router';

function render(component: any): RenderResult {
  const utils = originalRender(component, {
    global: {
      plugins: [
        createI18n({ legacy: false, fallbackWarn: false, missingWarn: false }),
        formkit,
        pinia,
        router,
      ],
      provide: { [DefaultApolloClient]: apolloClient },
    },
    props: { id: 'ciud' },
  });
  return { ...utils };
}

export { render };
