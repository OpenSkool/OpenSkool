module.exports = {
	root: true,
	extends: '@os',
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
	overrides: [
		{
			files: 'src/**',
			extends: 'noise/node',
		},
		{
			files: 'prisma/**',
			extends: ['noise/node', 'noise/node/script'],
			rules: {
				'@typescript-eslint/no-magic-numbers': 'off',
			},
		},
		{
			files: ['*', '**/*.spec.*'],
			rules: {
				'node/no-unpublished-import': 'off',
			},
		},
	],
};
