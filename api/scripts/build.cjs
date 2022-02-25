const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const glob = require('fast-glob');

esbuild.build({
  bundle: false,
  entryPoints: glob.sync(['src/**/*.ts']),
  format: 'cjs',
  minify: false,
  outdir: 'dist/',
  platform: 'node',
  plugins: [nodeExternalsPlugin()],
  sourcemap: true,
  target: 'node16',
});
