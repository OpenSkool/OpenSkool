import path from 'path';

import { Language } from '@prisma/client';
import {
  idArg,
  inputObjectType,
  interfaceType,
  list,
  makeSchema,
  mutationField,
  objectType,
  queryType,
} from 'nexus';
import * as N from 'nexus-prisma';

import type { Context } from './context';

const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id', { description: 'A CUID for a resource' });
  },
});

const Competency = objectType({
  name: N.Competency.$name,
  description: N.Competency.$description,
  definition(t) {
    t.implements(Node);
    t.field(N.Competency.parentCompetencyId);
    t.field({
      ...N.CompetencyTranslation.title,
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
  name: N.Education.$name,
  description: N.Education.$description,
  definition(t) {
    t.implements(Node);
    t.field({
      ...N.EducationTranslation.title,
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
    t.field(N.EducationTranslation.title);
  },
});

const createEducation = mutationField('createEducation', {
  type: Education,
  args: {
    data: EducationInput,
  },
  async resolve(root, { data: { title } }, ctx) {
    const { id } = await ctx.prisma.education.create({
      data: {
        translations: {
          create: { languageCode: Language.EN, title },
        },
      },
      select: { id: true },
    });
    return { id, title };
  },
});

const updateEducation = mutationField('updateEducation', {
  type: Education,
  args: {
    id: idArg(),
    data: EducationInput,
  },
  async resolve(root, { id, data: { title } }, ctx) {
    await ctx.prisma.educationTranslation.updateMany({
      data: { title },
      where: { educationId: id, languageCode: Language.EN },
    });
    return { id, title };
  },
});

const deleteEducation = mutationField('deleteEducation', {
  type: Education,
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
    t.field('competencies', {
      async resolve(parent, argumentz, ctx: Context, info) {
        return ctx.prisma.competency.findMany();
      },
      type: list(Competency),
    });
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
    export: 'Context',
    module: require.resolve('./context'),
  },
  features: {
    abstractTypeStrategies: { resolveType: false },
  },
  nonNullDefaults: { input: true, output: true },
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, '/generated/nexus.ts'),
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
    Competency,
    Education,
    EducationInput,
    // Mutations
    createEducation,
    updateEducation,
    deleteEducation,
  },
});
