import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { expect, MockedFunction, test, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { apolloClient } from '~/api';

import { formkit } from '../../formkit';
import CreateCompetency from './create-competency.vue';

const mockUseRouter = useRouter as unknown as MockedFunction<typeof useRouter>;

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: (): void => {
      /**/
    },
  })),
}));

test('title is required', async () => {
  const push = vi.fn();
  mockUseRouter.mockImplementationOnce((): any => ({
    push,
  }));
  const user = userEvent.setup();
  const { findByText, getByRole } = render(CreateCompetency, {
    global: {
      plugins: [
        createI18n({ legacy: false, fallbackWarn: false, missingWarn: false }),
        formkit,
      ],
    },
  });
  const submitButton = getByRole('button', {
    name: /form.action.create.label/i,
  });
  user.click(submitButton);
  await findByText('Competencies.form.nameLabel is required.');
  expect(push).not.toHaveBeenCalled();
});

test('create competency', async () => {
  const push = vi.fn();
  mockUseRouter.mockImplementationOnce((): any => ({
    push,
  }));
  const user = userEvent.setup();
  const { getByRole } = render(CreateCompetency, {
    global: {
      plugins: [
        createI18n({ legacy: false, fallbackWarn: false, missingWarn: false }),
        formkit,
      ],
      provide: { [DefaultApolloClient]: apolloClient },
    },
  });

  const titleInput = getByRole('textbox', { name: /form.namelabel/i });
  await user.type(titleInput, 'Hello World!');

  const submitButton = getByRole('button', {
    name: /form.action.create.label/i,
  });
  await user.click(submitButton);

  await waitFor(() => {
    expect(push).toHaveBeenCalled();
  });
});
