module.exports = {
  root: true,
  extends: '@os',
  ignorePatterns: ['src/components.d.ts'],
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
    {
      files: ['src/pages/**/*.vue', '!src/pages/**/components/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
};
