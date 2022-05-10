import userEvent from '@testing-library/user-event';
import { render, waitFor, screen } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { expect, MockedFunction, test, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { apolloClient } from '~/apollo';

import { formkit } from '../../formkit';
import RootCompetencyCreate from './root-competency-create.vue';

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
  render(RootCompetencyCreate, {
    global: {
      plugins: [
        createI18n({ legacy: false, fallbackWarn: false, missingWarn: false }),
        formkit,
      ],
    },
    props: {
      frameworkId: 'cuid',
    },
  });
  const submitButton = screen.getByRole('button', {
    name: /competencies.form.action.create.label/i,
  });
  user.click(submitButton);
  await screen.findByText('Competencies.form.nameLabel is required.');
  expect(push).not.toHaveBeenCalled();
});

test('create rootCompetency submit', async () => {
  const push = vi.fn();
  mockUseRouter.mockImplementationOnce((): any => ({
    push,
  }));
  const user = userEvent.setup();
  render(RootCompetencyCreate, {
    global: {
      plugins: [
        createI18n({ legacy: false, fallbackWarn: false, missingWarn: false }),
        formkit,
      ],
      provide: { [DefaultApolloClient]: apolloClient },
    },
    props: {
      competencyId: 'cuid',
      frameworkId: 'cuid',
    },
  });

  const titleInput: HTMLInputElement = screen.getByRole('textbox', {
    name: /competencies.form.namelabel/i,
  });
  await user.type(titleInput, 'Hello World!');

  const submitButton = screen.getByRole('button', {
    name: /competencies.form.action.create.label/i,
  });
  await user.click(submitButton);

  await waitFor(() => {
    expect(push).toHaveBeenCalled();
  });
});
