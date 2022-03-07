import path from 'path';

import { makeSchema } from 'nexus';

import * as types from './types/module';

export default makeSchema({
  contextType: {
    export: 'Context',
    module: require.resolve('./context'),
  },
  nonNullDefaults: { input: true, output: false },
  outputs: {
    schema: path.resolve('src/generated/schema.graphql'),
    typegen: path.resolve('src/generated/nexus.ts'),
  },
  prettierConfig: {
    arrowParens: 'always',
    singleQuote: true,
    trailingComma: 'all',
  },
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  sourceTypes: {
    modules: [{ alias: 'db', module: path.join(__dirname, 'source-types.ts') }],
  },
  types,
});
