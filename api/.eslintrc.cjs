module.exports = {
  root: true,
  extends: '@os',
  ignorePatterns: ['src/api/generated/**'],
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
