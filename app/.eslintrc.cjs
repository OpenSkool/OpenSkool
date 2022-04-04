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
    {
      files: ['src/spec/**/*', 'src/**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'import/no-unassigned-import': 'off',
      },
    },
  ],
};
