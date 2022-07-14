import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/vue';
import { expect, test, vi } from 'vitest';

import { router } from '~/router';
import { render } from '~/spec/render';

import CompetencyEdit from './competency-edit.vue';

test('input field has prefilled value', async () => {
  render(CompetencyEdit);

  const titleInput: HTMLInputElement = await screen.findByRole('textbox', {
    name: /field.name/,
  });

  expect(titleInput.value).toBe('Title defined in handlers.ts');
});

test('alert shows when empty field is submitted', async () => {
  render(CompetencyEdit);
  await router.isReady();
  const user = userEvent.setup();

  const titleInput = await screen.findByRole('textbox', { name: /field.name/ });
  await user.clear(titleInput);
  const submitButton = screen.getByRole('button', { name: /submitButton/ });
  await user.click(submitButton);

  await screen.findByText(/field.name is required./);
});

test('form submission works', async () => {
  render(CompetencyEdit);
  await router.isReady();
  const spyRouterPush = vi.spyOn(router, 'push');
  const user = userEvent.setup();

  const submitButton = await screen.findByRole('button', {
    name: /submitButton/,
  });
  await user.click(submitButton);

  waitFor(() => {
    expect(spyRouterPush).toBeCalled();
  });
  spyRouterPush.mockRestore();
});
