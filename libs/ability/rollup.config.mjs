import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const external = (id) => !/^[./]/.test(id);
const input = 'src/index.ts';

export default defineConfig([
  {
    external,
    input,
    output: [
      {
        file: `dist/index.js`,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [esbuild()],
  },
  {
    external,
    input,
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
    plugins: [dts()],
  },
]);
