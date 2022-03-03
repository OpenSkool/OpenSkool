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
    {
      files: 'prisma/',
      extends: ['noise/node', 'noise/node/script'],
    },
  ],
};
