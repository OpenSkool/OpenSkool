import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { expect, spyOn, test } from 'vitest';

import { router } from '~/router';
import { render } from '~/spec/render';

import edit from './edit.vue';

test('input field has prefilled value', async () => {
  render(edit);
  const titleInput: HTMLInputElement = await screen.findByRole('textbox', {
    name: 'competencies.form.nameLabel',
  });
  expect(titleInput.value).toBe('Title defined in handlers.ts');
});

test('alert shows when empty field is submitted', async () => {
  render(edit);
  await router.isReady();
  const push = spyOn(router, 'push');
  const user = userEvent.setup();
  const titleInput: HTMLInputElement = await screen.findByRole('textbox', {
    name: 'competencies.form.nameLabel',
  });
  await user.clear(titleInput);
  const submitButton = screen.getByRole('button', {
    name: 'competencies.form.action.edit.label',
  });
  await user.click(submitButton);
  await screen.findByText('Competencies.form.nameLabel is required.');
  expect(push).not.toBeCalled();
});

test('form submission works', async () => {
  render(edit);
  await router.isReady();
  const push = spyOn(router, 'push');
  const user = userEvent.setup();
  const submitButton = await screen.findByRole('button', {
    name: 'competencies.form.action.edit.label',
  });
  await user.click(submitButton);
  expect(push).toBeCalled();
});
