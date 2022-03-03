import path from 'path';

import * as Db from '@prisma/client';
import { Kind } from 'graphql';
import {
  idArg,
  inputObjectType,
  interfaceType,
  list,
  makeSchema,
  mutationField,
  nullable,
  objectType,
  queryType,
  scalarType,
} from 'nexus';

import type { Context } from './context';

const DateScalar = scalarType({
  asNexusMethod: 'date',
  name: 'Date',
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error(`could not parse date: ${String(value)}`);
  },
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error(`could not serialize date: ${String(value)}`);
  },
});

const Node = interfaceType({
  name: 'Node',
  description: 'A node is any resource that can be identified via an ID.',
  definition(t) {
    t.id('id', { description: 'A CUID for a resource' });
  },
});

const Accountable = interfaceType({
  name: 'Accountable',
  description:
    'An accountable resource tracks when and by whom it was created and last updated.',
  definition(t) {
    t.date('createdAt');
    t.date('updatedAt');
  },
});

const Competency = interfaceType({
  name: 'Competency',
  description:
    'A competency can be an individual competence or a grouping of competences.',
  definition(t) {
    t.implements(Node);
    t.implements(Accountable);
    t.string('title', {
      resolve(competency, argumentz, ctx) {
        return competency.translations[0].title;
      },
    });
  },
});

const NestedCompetency = objectType({
  name: 'NestedCompetency',
  description: 'A competency with a parent.',
  definition(t) {
    t.implements(Competency);
    t.id('parentId', {
      resolve(competency, argumentz, ctx): string {
        return competency.parentCompetencyId!;
      },
    });
  },
});

const RootCompetency = objectType({
  name: 'RootCompetency',
  description: 'A competency without a parent.',
  definition(t) {
    t.implements(Competency);
    t.field('nestedCompetencies', {
      type: list('NestedCompetency'),
    });
  },
});

const Education = objectType({
  name: 'Education',
  definition(t) {
    t.implements(Node);
    t.implements(Accountable);
    t.string('title', {
      resolve: async (education, argumentz, ctx) => {
        return education.translations[0].title;
      },
    });
  },
});

const EducationInput = inputObjectType({
  name: 'EducationInput',
  definition(t) {
    t.string('title');
  },
});

const createEducation = mutationField('createEducation', {
  type: Education,
  args: {
    data: EducationInput,
  },
  async resolve(root, { data: { title } }, ctx) {
    const education = await ctx.prisma.education.create({
      data: {
        translations: {
          create: { languageCode: Db.Language.EN, title },
        },
      },
      include: { translations: true },
    });
    return { ...education, title };
  },
});

const updateEducation = mutationField('updateEducation', {
  type: Education,
  args: {
    id: idArg(),
    data: EducationInput,
  },
  async resolve(root, { id, data: { title } }, ctx) {
    const upsert = {
      languageCode: Db.Language.EN,
      title,
    };
    const education = await ctx.prisma.education.update({
      data: {
        translations: {
          upsert: {
            create: upsert,
            update: upsert,
            where: {
              educationId_languageCode: {
                educationId: id,
                languageCode: Db.Language.EN,
              },
            },
          },
        },
      },
      include: { translations: true },
      where: { id },
    });
    return {
      ...education,
      title,
    };
  },
});

const deleteEducation = mutationField('deleteEducation', {
  type: Node,
  args: {
    id: idArg(),
  },
  async resolve(root, { id }, ctx) {
    return ctx.prisma.education.delete({
      where: { id },
    });
  },
});

const Query = queryType({
  definition(t) {
    t.field('rootCompetency', {
      args: { id: idArg() },
      async resolve(parent, { id }, ctx: Context, info) {
        return ctx.prisma.competency.findUnique({
          include: { nestedCompetencies: true, translations: true },
          where: { id },
        });
      },
      type: nullable(RootCompetency),
    });
    t.field('allEducations', {
      async resolve(parent, argumentz, ctx: Context, info) {
        return ctx.prisma.education.findMany({
          include: { translations: true },
        });
      },
      type: list(Education),
    });
  },
});

export default makeSchema({
  contextType: {
    export: 'Context',
    module: require.resolve('./context'),
  },
  features: {
    abstractTypeStrategies: { resolveType: false },
  },
  nonNullDefaults: { input: true, output: true },
  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/nexus.ts'),
  },
  prettierConfig: {
    arrowParens: 'always',
    singleQuote: true,
    trailingComma: 'all',
  },
  sourceTypes: {
    modules: [{ alias: 'db', module: path.join(__dirname, 'source-types.ts') }],
  },
  types: {
    // Scalars
    DateScalar,
    // Interfaces
    Accountable,
    Node,
    // Models
    // -- Competency --//
    Competency,
    NestedCompetency,
    RootCompetency,
    // -- Education --//
    Education,
    EducationInput,
    // Root
    Query,
    // Mutations
    createEducation,
    updateEducation,
    deleteEducation,
  },
});
