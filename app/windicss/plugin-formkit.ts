import plugin from 'windicss/plugin';

/**
 * Modeled after the FormKit tailwindcss plugin.
 * https://github.com/formkit/formkit/tree/master/packages/tailwindcss
 * https://github.com/formkit/formkit/blob/master/packages/tailwindcss/src/index.ts
 */

export default plugin(({ addVariant }) => {
	addVariant('formkit-disabled', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `.${className}[data-disabled]`;
		});
	});
	addVariant('formkit-invalid', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `[data-invalid] .${className}`;
		});
	});

	// NOTE: The variants below have NOT been tested yet! The selectors might need tweaking.

	addVariant('formkit-errors', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `[data-errors] .${className}`;
		});
	});
	addVariant('formkit-complete', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `[data-complete] .${className}`;
		});
	});
	addVariant('formkit-loading', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `[data-loading] .${className}`;
		});
	});
	addVariant('formkit-submitted', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `[data-submitted] .${className}`;
		});
	});
	addVariant('formkit-multiple', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `[data-multiple] .${className}`;
		});
	});

	addVariant('formkit-action', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `.formkit-actions .${className}`;
		});
	});

	addVariant('formkit-message-validation', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `[data-message-type="validation"] .${className}`;
		});
	});

	addVariant('formkit-message-error', ({ modifySelectors }) => {
		return modifySelectors(({ className }) => {
			return `[data-message-type="error"] .${className}`;
		});
	});
});
