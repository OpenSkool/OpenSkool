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
      type: list(nonNull('NestedCompetency')),
    });
  },
});

export const competencyQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('rootCompetency', {
      args: { id: idArg() },
      async resolve(parent, { id }, ctx: Context, info) {
        const competency = ctx.prisma.competency.findUnique({
          include: {
            nestedCompetencies: {
              include: {
                translations: { where: { languageCode: Db.Language.EN } },
              },
              where: {
                translations: { some: { languageCode: Db.Language.EN } },
              },
            },
            translations: true,
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
