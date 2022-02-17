import path from 'path';

import cuid from 'cuid';
import {
  idArg,
  inputObjectType,
  interfaceType,
  list,
  makeSchema,
  mutationField,
  nonNull,
  objectType,
  queryType,
  stringArg,
} from 'nexus';
import * as N from 'nexus-prisma';

import { Context } from './context';

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

const EducationInput = inputObjectType({
  name: 'EducationInput',
  nonNullDefaults: { input: true },
  definition(t) {
    t.field(N.Education.name.name, {
      description: N.Education.name.description,
      type: 'String',
    });
  },
});

const createEducation = mutationField('createEducation', {
  type: nonNull(Education),
  args: {
    name: nonNull(stringArg()),
  },
  async resolve(parent, { name }: { name: string }, ctx: Context) {
    return ctx.prisma.education.create({
      data: { id: cuid(), name },
    });
  },
});

const updateEducation = mutationField('updateEducation', {
  type: nonNull(Education),
  args: {
    id: nonNull(idArg()),
    name: nonNull(stringArg()),
  },
  async resolve(
    parent,
    { id, name }: { id: string; name: string },
    ctx: Context,
  ) {
    return ctx.prisma.education.update({
      data: { name },
      where: { id },
    });
  },
});

const deleteEducation = mutationField('deleteEducation', {
  type: Education,
  args: {
    id: nonNull(idArg()),
  },
  async resolve(parent, { id }: { id: string }, ctx: Context) {
    return ctx.prisma.education.delete({
      where: { id },
    });
  },
});

const Query = queryType({
  nonNullDefaults: { output: true },
  definition(t) {
    t.field('educations', {
      async resolve(parent, argumentz, ctx: Context, info) {
        return ctx.prisma.education.findMany();
      },
      type: list(Education),
    });
  },
});

export default makeSchema({
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  features: {
    abstractTypeStrategies: { resolveType: false },
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
    // Root
    Query,
    // Generics
    Node,
    // -- Education --//
    // Models
    Education,
    EducationInput,
    // Mutations
    createEducation,
    updateEducation,
    deleteEducation,
  },
});
