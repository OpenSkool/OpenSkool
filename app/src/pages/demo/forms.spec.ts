import { render, waitFor } from '@testing-library/vue';
import { createPinia } from 'pinia';
import { expect, test } from 'vitest';
import { createI18n } from 'vue-i18n';

import { formkit } from '../../formkit';
import FormsRoute from './forms.vue';

test('title is required', async () => {
  const { getByRole } = render(FormsRoute, {
    global: {
      plugins: [
        createI18n({ legacy: false, fallbackWarn: false, missingWarn: false }),
        createPinia(),
        formkit,
      ],
    },
  });

  await waitFor(() => {
    expect(getByRole('heading', { level: 2 })).toHaveProperty(
      'textContent',
      'demo.forms.title',
    );
  });
});
