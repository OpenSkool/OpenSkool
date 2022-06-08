import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { expect, test, vi } from 'vitest';

import { router } from '~/router';
import { render } from '~/spec/render';

import CompetencyEditPage from './competency-edit-page.vue';

test('input field has prefilled value', async () => {
  render(CompetencyEditPage);
  const titleInput: HTMLInputElement = await screen.findByRole('textbox', {
    name: 'competencies.form.name',
  });
  expect(titleInput.value).toBe('Title defined in handlers.ts');
});

test('alert shows when empty field is submitted', async () => {
  render(CompetencyEditPage);
  await router.isReady();
  const push = vi.spyOn(router, 'push');
  const user = userEvent.setup();
  const titleInput: HTMLInputElement = await screen.findByRole('textbox', {
    name: 'competencies.form.name',
  });
  await user.clear(titleInput);
  const submitButton = screen.getByRole('button', {
    name: 'competencies.form.action.edit.label',
  });
  await user.click(submitButton);
  await screen.findByText('Competencies.form.name is required.');
  expect(push).not.toBeCalled();
});

test('form submission works', async () => {
  render(CompetencyEditPage);
  await router.isReady();
  const push = vi.spyOn(router, 'push');
  const user = userEvent.setup();
  const submitButton = await screen.findByRole('button', {
    name: 'competencies.form.action.edit.label',
  });
  await user.click(submitButton);
  expect(push).toBeCalled();
});
