import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/vue';
import { expect, spyOn, test } from 'vitest';

import { render } from '~/spec/render';

import index from './index.vue';

import 'the-new-css-reset/css/reset.css';
import 'virtual:windi.css';
import { router } from '~/router';

test.only('delete competency works', async () => {
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
