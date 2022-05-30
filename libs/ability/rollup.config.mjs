import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [
      // Lifted from Vite's default browserslist config
      // > npx browserslist 'defaults and supports es6-module and supports es6-module-dynamic-import, not opera > 0, not samsung > 0, not and_qq > 0
      esbuild({
        target: [
          'node16.15',
          'chrome99',
          'edge99',
          'firefox91',
          'ios12.2',
          'safari14.1',
        ],
      }),
    ],
    output: [
      {
        file: `dist/index.js`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
  }),
];
