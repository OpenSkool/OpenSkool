module.exports = {
  root: true,
  extends: '@os',
  parserOptions: {
    extraFileExtensions: ['.vue'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Disabled because VSCode ESLint extension misrapports these two rules.
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: 'src/',
      extends: 'noise/web-app',
    },
  ],
};
