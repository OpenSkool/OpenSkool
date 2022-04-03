module.exports = {
  root: true,
  extends: '@os',
  ignorePatterns: ['src/generated/**'],
  parserOptions: {
    extraFileExtensions: ['.vue'],
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['src/**/*'],
      extends: 'noise/web-app',
      rules: {
        '@typescript-eslint/no-unused-expressions': [
          'error',
          { allowTaggedTemplates: true },
        ],
      },
    },
    {
      files: ['src/pages/**/*.vue', '!src/pages/**/components/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    {
      files: ['themes/*'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
    {
      files: ['src/components/**/fk-*.vue'],
      rules: {
        'no-underscore-dangle': 'off',
      },
    },
  ],
};
