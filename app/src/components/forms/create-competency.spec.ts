import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { expect, MockedFunction, test, vi } from 'vitest';
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
  const { findByText, getByText } = render(CreateCompetency, {
    global: { plugins: [formkit] },
  });
  const submitButton = getByText(/create/i);
  user.click(submitButton);
  await findByText('Title is required.');
  expect(push).not.toHaveBeenCalled();
});

test('create competency', async () => {
  const push = vi.fn();
  mockUseRouter.mockImplementationOnce((): any => ({
    push,
  }));
  const user = userEvent.setup();
  const { getByText, getByLabelText } = render(CreateCompetency, {
    global: {
      plugins: [formkit],
      provide: { [DefaultApolloClient]: apolloClient },
    },
  });

  const titleInput = getByLabelText('Title');
  await user.type(titleInput, 'Hello World!');

  const submitButton = getByText(/create/i);
  await user.click(submitButton);

  await waitFor(() => {
    expect(push).toHaveBeenCalled();
  });
});
