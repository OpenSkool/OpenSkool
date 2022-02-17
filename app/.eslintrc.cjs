module.exports = {
  root: true,
  extends: '@os',
  parserOptions: {
    extraFileExtensions: ['.vue'],
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: 'src/',
      extends: 'noise/web-app',
    },
  ],
};
