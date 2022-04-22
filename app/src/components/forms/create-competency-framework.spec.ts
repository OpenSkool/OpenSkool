import userEvent from '@testing-library/user-event';
import { render, waitFor, screen } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { expect, MockedFunction, test, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { apolloClient } from '~/apollo';

import { formkit } from '../../formkit';
import CreateCompetencyFramework from './create-competency-framework.vue';

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
  render(CreateCompetencyFramework, {
    global: {
      plugins: [
        createI18n({ legacy: false, fallbackWarn: false, missingWarn: false }),
        formkit,
      ],
    },
  });
  const submitButton = screen.getByRole('button', {
    name: 'frameworks.form.action.create.label',
  });
  user.click(submitButton);
  await screen.findByText('Frameworks.form.nameLabel is required.');
  expect(push).not.toHaveBeenCalled();
});

test('create competencyFramework submit', async () => {
  const push = vi.fn();
  mockUseRouter.mockImplementationOnce((): any => ({
    push,
  }));
  const user = userEvent.setup();
  render(CreateCompetencyFramework, {
    global: {
      plugins: [
        createI18n({ legacy: false, fallbackWarn: false, missingWarn: false }),
        formkit,
      ],
      provide: { [DefaultApolloClient]: apolloClient },
    },
  });

  const titleInput: HTMLInputElement = screen.getByRole('textbox', {
    name: 'frameworks.form.nameLabel',
  });
  await user.type(titleInput, 'Hello World!');

  const submitButton = screen.getByRole('button', {
    name: 'frameworks.form.action.create.label',
  });
  await user.click(submitButton);

  await waitFor(() => {
    expect(push).toHaveBeenCalled();
  });
});
