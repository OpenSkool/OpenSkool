import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/vue';
import { expect, spyOn, test } from 'vitest';

import { router } from '~/router';
import { render } from '~/spec/render';

import index from './index.vue';

test('delete competency works', async () => {
  render(index);
  await router.isReady();
  const replace = spyOn(router, 'replace');
  const user = userEvent.setup();
  const openDeleteModalButton: HTMLButtonElement = await screen.findByRole(
    'button',
    {
      name: 'competencies.route.id.index.action.openDeleteModal',
    },
  );
  await user.click(openDeleteModalButton);
  const deleteButton: HTMLButtonElement = screen.getByRole('button', {
    name: 'competencies.route.id.index.confirmDeleteModal.action.confirm',
  });
  await user.click(deleteButton);
  await waitFor(() => {
    expect(replace).toBeCalled();
  });
});
