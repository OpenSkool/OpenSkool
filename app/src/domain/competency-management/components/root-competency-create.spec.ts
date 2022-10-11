import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/vue';
import { expect, test, vi } from 'vitest';

import { router } from '~/router';
import { render } from '~/spec/render';

import RootCompetencyCreate from './root-competency-create.vue';

const props = {
	frameworkId: 'test-framework-id',
};

test('title is required', async () => {
	render(RootCompetencyCreate, { props });
	const user = userEvent.setup();

	const submitButton = screen.getByRole('button', { name: /submitButton/ });
	await user.click(submitButton);

	screen.getByText(/field.name is required./);
});

test('create rootCompetency submit', async () => {
	render(RootCompetencyCreate, { props });
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
