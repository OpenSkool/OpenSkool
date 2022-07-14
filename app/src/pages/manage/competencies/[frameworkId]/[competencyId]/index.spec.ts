import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/vue';
import { expect, test, vi } from 'vitest';

import { router } from '~/router';
import { render } from '~/spec/render';

import CompetencyDetailRoute from './index.vue';

test('delete competency works', async () => {
  render(CompetencyDetailRoute, {
    props: {
      competencyId: 'test-competency-id',
      frameworkId: 'test-framework-id',
    },
  });
  await router.isReady();
  const user = userEvent.setup();
  const mockRouterReplace = vi.spyOn(router, 'replace');

  const openDeleteModalButton = await screen.findByRole('button', {
    name: /action.delete/,
  });
  await user.click(openDeleteModalButton);
  const deleteButton = screen.getByRole('button', { name: /action.confirm/ });
  await user.click(deleteButton);

  await waitFor(() => {
    expect(mockRouterReplace).toHaveBeenCalled();
  });
  mockRouterReplace.mockReset();
});
