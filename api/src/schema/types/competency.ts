import * as Db from '@prisma/client';
import {
  extendType,
  idArg,
  interfaceType,
  list,
  nonNull,
  objectType,
} from 'nexus';

import { Context } from '../context';
import { Accountable, Node } from './interfaces';

export const Competency = interfaceType({
  name: 'Competency',
  description:
    'A competency can be an individual competence or a grouping of competences.',
  definition(t) {
    t.implements(Node);
    t.implements(Accountable);
    t.nonNull.string('title', {
      resolve(competency, argumentz, ctx) {
        return competency.translations[0].title;
      },
    });
    t.nonNull.field('subCompetencies', {
      type: nonNull(list(nonNull('NestedCompetency'))),
      async resolve(parent, argumentz, ctx) {
        const subCompetencies = await ctx.prisma.competency
          .findUnique({ where: { id: parent.id } })
          .subCompetencies({
            include: {
              translations: { where: { languageCode: Db.Language.EN } },
            },
          });
        return subCompetencies.filter(
          (competency) => competency.translations.length > 0,
        );
      },
    });
  },
});

export const NestedCompetency = objectType({
  name: 'NestedCompetency',
  description: 'A competency with a parent.',
  definition(t) {
    t.implements(Competency);
    t.nonNull.id('parentId', {
      resolve(competency, argumentz, ctx): string {
        return competency.parentCompetencyId!;
      },
    });
  },
});

export const RootCompetency = objectType({
  name: 'RootCompetency',
  description: 'A competency without a parent.',
  definition(t) {
    t.implements(Competency);
    t.nonNull.field('nestedCompetencies', {
      type: nonNull(list(nonNull('NestedCompetency'))),
      async resolve(parent, argumentz, ctx) {
        const nestedCompetencies = await ctx.prisma.competency
          .findUnique({ where: { id: parent.id } })
          .subCompetencies({
            include: {
              translations: { where: { languageCode: Db.Language.EN } },
            },
          });
        return nestedCompetencies.filter(
          (competency) => competency.translations.length > 0,
        );
      },
    });
  },
});

export const competencyQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('rootCompetency', {
      args: { id: idArg() },
      async resolve(root, { id }, ctx: Context, info) {
        const competency = ctx.prisma.competency.findUnique({
          include: {
            translations: { where: { languageCode: Db.Language.EN } },
          },
          where: { id },
        });
        if (competency.translations.length === 0) {
          return null;
        }
        return competency;
      },
      type: 'RootCompetency',
    });
  },
});
