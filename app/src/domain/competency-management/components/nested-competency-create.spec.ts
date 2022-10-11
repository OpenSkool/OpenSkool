import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/vue';
import { expect, test, vi } from 'vitest';

import { router } from '~/router';
import { render } from '~/spec/render';

import NestedCompetencyCreate from './nested-competency-create.vue';

const props = {
	competencyId: 'test-competency-id',
	frameworkId: 'test-framework-id',
};

test('title is required', async () => {
	render(NestedCompetencyCreate, { props });
	const user = userEvent.setup();

	const submitButton = screen.getByRole('button', { name: /submitButton/ });
	await user.click(submitButton);

	screen.getByText(/field.name is required./);
});

test('create competency submit', async () => {
	render(NestedCompetencyCreate, { props });
	const spyRouterPush = vi.spyOn(router, 'push');
	const user = userEvent.setup();

	const titleInput = screen.getByRole('textbox', { name: /field.name/ });
	await user.type(titleInput, 'Hello World!');
	const submitButton = screen.getByRole('button', { name: /submitButton/ });
	await user.click(submitButton);

	await waitFor(() => {
		expect(spyRouterPush).toHaveBeenCalled();
	});
	spyRouterPush.mockRestore();
});
