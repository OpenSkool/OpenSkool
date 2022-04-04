import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/vue';
import { expect, MockedFunction, test, vi } from 'vitest';
import { useRouter } from 'vue-router';

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
