module.exports = {
  extends: 'noise',
  ignorePatterns: ['coverage/', 'dist/', 'node_modules/'],
  rules: {
    // Disabled because VSCode ESLint extension misrapports these two rules.
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'unicorn/expiring-todo-comments': [
      'error',
      { allowWarningComments: false, ignore: ['#\\d+'] },
    ],
  },
  overrides: [
    {
      files: ['*.{cjs,mjs,js,ts}', '**/scripts/**/*'],
      extends: ['noise/node', 'noise/node/script'],
    },
    {
      files: ['**/*.ts'],
      extends: ['noise/typescript'],
    },
    {
      files: ['**/*.vue'],
      extends: ['noise/typescript', 'noise/vue', 'noise/vue/ts'],
    },
    {
      files: ['**/**.spec.ts'],
      rules: {
        '@typescript-eslint/no-magic-numbers': 'off',
      },
    },
  ],
};
