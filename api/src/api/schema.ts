import path from 'path';

import { Language } from '@prisma/client';
import { Kind } from 'graphql';
import {
  idArg,
  inputObjectType,
  interfaceType,
  list,
  makeSchema,
  mutationField,
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
  definition(t) {
    t.id('id', { description: 'A CUID for a resource' });
  },
});

const Accountable = interfaceType({
  name: 'Accountable',
  definition(t) {
    t.date('createdAt');
    t.date('updatedAt');
  },
});

const Competency = objectType({
  name: 'Competency',
  definition(t) {
    t.implements(Node);
    t.implements(Accountable);
    t.nullable.string('parentCompetencyId');
    t.string('title', {
      async resolve(competency, argumentz, ctx) {
        const translations = await ctx.prisma.competencyTranslation.findMany({
          where: {
            competencyId: competency.id,
            languageCode: Language.EN,
          },
        });
        return translations[0]?.title ?? 'Untitled';
      },
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
        const translations = await ctx.prisma.educationTranslation.findMany({
          where: {
            educationId: education.id,
            languageCode: Language.EN,
          },
        });
        return translations[0]?.title ?? 'Untitled';
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
          create: { languageCode: Language.EN, title },
        },
      },
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
      languageCode: Language.EN,
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
                languageCode: Language.EN,
              },
            },
          },
        },
      },
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
  nonNullDefaults: { output: true },
  definition(t) {
    t.field('allCompetencies', {
      async resolve(parent, argumentz, ctx: Context, info) {
        return ctx.prisma.competency.findMany();
      },
      type: list(Competency),
    });
    t.field('allEducations', {
      async resolve(parent, argumentz, ctx: Context, info) {
        return ctx.prisma.education.findMany();
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
    modules: [{ alias: 'prisma', module: '@prisma/client' }],
  },
  types: {
    // Scalars
    DateScalar,
    // Interfaces
    Accountable,
    Node,
    // -- Education --//
    // Models
    Competency,
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
