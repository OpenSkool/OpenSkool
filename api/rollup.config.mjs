import esbuild from 'rollup-plugin-esbuild';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

const bundle = (config) => ({
  ...config,
  input: 'src/server.ts',
  external: (id) => !/^[./~]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild(), typescriptPaths({ preserveExtensions: true })],
    output: [
      {
        file: `dist/index.js`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
];
