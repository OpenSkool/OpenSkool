import path from 'path';

import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig({
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
      dts: 'src/generated/auto-imports.d.ts',
    }),
    Components({
      dts: 'src/generated/components.d.ts',
      resolvers: [
        HeadlessUiResolver(),
        IconsResolver({
          enabledCollections: ['ri'],
          prefix: false,
        }),
      ],
    }),
    Icons({ compiler: 'vue3' }),
    Pages(),
    Vue(),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/spec/setup.ts'],
  },
});
