import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/vue';
import { expect, test, vi } from 'vitest';

import { CompetencyFrameworkCreate } from '~/domain/competency-management';
import { router } from '~/router';
import { render } from '~/spec/render';

test('title is required', async () => {
	render(CompetencyFrameworkCreate);
	const user = userEvent.setup();

	const submitButton = screen.getByRole('button', { name: /submitButton/ });
	await user.click(submitButton);

	screen.getByText(/field.name is required./);
});

test('create competencyFramework submit', async () => {
	render(CompetencyFrameworkCreate);
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
