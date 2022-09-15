import fs from 'node:fs';
import path from 'node:path';

import VueI18n from '@intlify/vite-plugin-vue-i18n';
import Vue from '@vitejs/plugin-vue';
import visualizer from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import Codegen from 'vite-plugin-graphql-codegen';
import Pages from 'vite-plugin-pages';
import WindiCSS from 'vite-plugin-windicss';
import { defineConfig } from 'vitest/config';

const windiConfigFilepath = `themes/${process.env.WINDI_THEME ?? 'default'}.ts`;
fs.accessSync(windiConfigFilepath);

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        visualizer({ filename: path.join(__dirname, 'dist/stats.html') }),
      ],
    },
    sourcemap: true,
  },
  define: {
    // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags
    __INTLIFY_PROD_DEVTOOLS__: false,
    __VUE_I18N_FULL_INSTALL__: false,
    __VUE_I18N_LEGACY_API__: false,
  },
  plugins: [
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          '@apollo/client/core': ['gql'],
          '@vue/apollo-composable': [
            'useMutation',
            'useQuery',
            'useSubscription',
          ],
          'vue-i18n': ['useI18n'],
          '~/ability': ['useAppAbility'],
        },
      ],
      dts: 'src/vite-types/auto-imports.d.ts',
    }),
    {
      ...Codegen({ runOnBuild: false }),
      apply: 'serve',
    },
    Components({
      dirs: ['src/ui'],
      dts: 'src/vite-types/components.d.ts',
      resolvers: [
        HeadlessUiResolver(),
        IconsResolver({
          enabledCollections: ['ri'],
          prefix: false,
        }),
      ],
      types: [],
    }),
    Icons({ compiler: 'vue3' }),
    Pages({
      exclude: ['**/*.spec.ts'],
    }),
    Vue(),
    VueI18n(),
    WindiCSS({
      config: windiConfigFilepath,
    }),
  ],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/spec/setup.ts'],
  },
});
