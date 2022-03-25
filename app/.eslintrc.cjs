module.exports = {
  root: true,
  extends: '@os',
  ignorePatterns: ['src/generated/**'],
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
      files: ['src/**/*'],
      extends: 'noise/web-app',
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
