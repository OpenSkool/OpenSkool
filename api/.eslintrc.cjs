module.exports = {
  root: true,
  extends: '@os',
  ignorePatterns: ['src/generated/**'],
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
