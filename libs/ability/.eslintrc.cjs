module.exports = {
  root: true,
  extends: '@os',
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: 'src/',
      extends: 'noise/node',
    },
  ],
};
