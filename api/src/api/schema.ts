import path from 'path';

import { makeSchema, objectType, queryType, list, interfaceType } from 'nexus';
import * as N from 'nexus-prisma';

import { prisma } from './prisma';

const Node = interfaceType({
  name: 'Node',
  nonNullDefaults: { output: true },
  definition(t) {
    t.id('id', { description: 'A CUID for a resource' });
  },
});

const Education = objectType({
  name: N.Education.$name,
  description: N.Education.$description,
  definition(t) {
    t.implements(Node);
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
  features: {
    abstractTypeStrategies: {
      resolveType: false,
    },
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
    Node,
    Query,
    // Models
    Education,
  },
});
