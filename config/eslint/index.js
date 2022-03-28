module.exports = {
  extends: 'noise',
  ignorePatterns: ['dist/', 'node_modules/'],
  rules: {
    // Disabled because VSCode ESLint extension misrapports these two rules.
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: ['*.{cjs,js,ts}', '**/scripts/**/*'],
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
        'no-magic-numbers': 'off',
      },
    },
  ],
};
