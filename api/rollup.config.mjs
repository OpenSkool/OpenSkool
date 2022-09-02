import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

export default defineConfig({
  external: (id) => !(id.startsWith('@os/') || /^[./~]/.test(id)),
  input: 'src/server.ts',
  output: [
    {
      file: `dist/index.js`,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    esbuild({ target: 'node16.17' }),
    typescriptPaths({ preserveExtensions: true }),
  ],
});
