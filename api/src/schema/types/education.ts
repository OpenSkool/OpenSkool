import * as Db from '@prisma/client';
import {
  extendType,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
} from 'nexus';

import { Context } from '../context';
import { Accountable, Node } from './interfaces';

export const Education = objectType({
  name: 'Education',
  definition(t) {
    t.implements(Node);
    t.implements(Accountable);
    t.nonNull.string('title', {
      resolve: async (education, argumentz, ctx) => {
        return education.translations[0].title;
      },
    });
  },
});

export const EducationQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('allEducations', {
      async resolve(root, argumentz, ctx: Context, info) {
        return ctx.prisma.education.findMany({
          include: {
            translations: { where: { languageCode: Db.Language.EN } },
          },
          where: {
            translations: { some: { languageCode: Db.Language.EN } },
          },
        });
      },
      type: nonNull(list(nonNull('Education'))),
    });
  },
});

export const EducationInput = inputObjectType({
  name: 'EducationInput',
  definition(t) {
    t.string('title');
  },
});

export const CreateEducation = mutationField('createEducation', {
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

export const UpdateEducation = mutationField('updateEducation', {
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

export const DeleteEducation = mutationField('deleteEducation', {
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
