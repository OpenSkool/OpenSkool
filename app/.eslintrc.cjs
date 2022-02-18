module.exports = {
  root: true,
  extends: '@os',
  parserOptions: {
    extraFileExtensions: ['.vue'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: 'src/',
      extends: 'noise/web-app',
    },
  ],
};
