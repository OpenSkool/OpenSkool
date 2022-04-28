import fs from 'fs';
import path from 'path';

import VueI18n from '@intlify/vite-plugin-vue-i18n';
import Vue from '@vitejs/plugin-vue';
import visualizer from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import Codegen from 'vite-plugin-graphql-codegen';
import Pages from 'vite-plugin-pages';
import WindiCSS from 'vite-plugin-windicss';

const windiConfigFilepath =
  process.env.WINDI_THEME == null
    ? undefined
    : `themes/${process.env.WINDI_THEME}.ts`;
if (windiConfigFilepath != null) {
  fs.accessSync(windiConfigFilepath);
}

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        visualizer({ filename: path.join(__dirname, 'dist/stats.html') }),
      ],
    },
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
            'useResult',
            'useSubscription',
          ],
        },
      ],
      dts: 'src/vite-types/auto-imports.d.ts',
    }),
    {
      ...Codegen({ runOnBuild: false }),
      apply: 'serve',
    },
    Components({
      dts: 'src/vite-types/components.d.ts',
      resolvers: [
        HeadlessUiResolver(),
        IconsResolver({
          enabledCollections: ['ri'],
          prefix: false,
        }),
      ],
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
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/spec/setup.ts'],
  },
});
