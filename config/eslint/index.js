module.exports = {
  extends: 'noise',
  ignorePatterns: ['dist/', 'node_modules/'],
  overrides: [
    {
      files: ['*.{cjs,js,ts}', '**/scripts/**/*'],
      extends: ['noise/node', 'noise/node/script'],
    },
    {
      files: ['**/*.ts'],
      extends: ['noise/typescript'],
    },
  ],
};
