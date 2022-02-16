import path from 'path';

import { makeSchema, objectType, queryType, list } from 'nexus';
import * as N from 'nexus-prisma';

import { prisma } from './prisma';

const Education = objectType({
  name: N.Education.$name,
  description: N.Education.$description,
  definition(t) {
    t.field(N.Education.id);
    t.field(N.Education.name);
  },
});

const Query = queryType({
  definition(t) {
    t.field('educations', {
      async resolve() {
        return prisma.education.findMany();
      },
      type: list(Education),
    });
  },
  nonNullDefaults: { output: true },
});

export default makeSchema({
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    // typegen: path.join(__dirname, '/generated/nexus.ts'),
  },
  prettierConfig: {
    arrowParens: 'always',
    singleQuote: true,
    trailingComma: 'all',
  },
  sourceTypes: {
    modules: [{ alias: 'prisma', module: '@prisma/client' }],
  },
  types: {
    // Generics
    Query,
    // Models
    Education,
  },
});
