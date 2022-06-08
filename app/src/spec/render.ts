import { render as originalRender, RenderResult } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { vi } from 'vitest';
import { createI18n } from 'vue-i18n';

import { AppAbility, casl } from '~/ability';
import { apolloClient } from '~/apollo';
import { formkit } from '~/formkit';
import { pinia } from '~/pinia';
import { router } from '~/router';

export function render(component: any): RenderResult {
  const ability = new AppAbility([{ action: 'manage', subject: 'all' }]);
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
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
