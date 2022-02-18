import path from 'path';

import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
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
      dts: 'src/auto-imports.d.ts',
    }),
    Pages(),
    Vue(),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
});
