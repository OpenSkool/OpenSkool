import {
  extendType,
  idArg,
  inputObjectType,
  interfaceType,
  list,
  mutationField,
  nonNull,
  objectType,
  unionType,
} from 'nexus';

import { ValidationError } from '../../errors';
import { CompetencyModel } from '../../services/competency';
import { CompetencyService } from '../../services/module';
import { Context } from '../context';
import { handleResolverError } from '../utils';
import { UserErrorModel } from './errors';
import { Accountable, Node } from './interfaces';

export const Competency = interfaceType({
  name: 'Competency',
  description:
    'A competency can be an individual competence or a grouping of competences.',
  definition(t) {
    t.implements(Node);
    t.implements(Accountable);
    t.field('subCompetencies', {
      type: list(nonNull('NestedCompetency')),
      async resolve(parent, argumentz, ctx) {
        try {
          return await CompetencyService.findSubCompetenciesByParentId(
            parent.id,
          );
        } catch (error) {
          handleResolverError(error, ctx);
        }
      },
    });
    t.nonNull.string('title', {
      resolve(competency, argumentz, ctx) {
        return competency.translations[0].title;
      },
    });
  },
  resolveType(competency) {
    return competency.rootCompetencyId == null
      ? 'RootCompetency'
      : 'NestedCompetency';
  },
});

export const NestedCompetency = objectType({
  name: 'NestedCompetency',
  description: 'A competency with a parent.',
  definition(t) {
    t.implements(Competency);
    t.nonNull.id('parentId', {
      resolve(competency, argumentz, ctx): string {
        if (competency.parentCompetencyId == null) {
          throw new Error(
            'A resolver tried to create a NestedCompetency of a Db.Competency without it having a parentCompetencyId',
          );
        }
        return competency.parentCompetencyId;
      },
    });
  },
  sourceType: {
    export: 'CompetencyModel',
    module: require.resolve('../../services/competency'),
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
        try {
          return await CompetencyService.getNestedCompetenciesByRootId(
            parent.id,
          );
        } catch (error) {
          handleResolverError(error, ctx);
        }
      },
    });
  },
  sourceType: {
    export: 'CompetencyModel',
    module: require.resolve('../../services/competency'),
  },
});

export const CompetencyQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('allRootCompetencies', {
      async resolve(root, argumentz, ctx) {
        try {
          return await CompetencyService.getAllRootCompetencies();
        } catch (error) {
          handleResolverError(error, ctx);
        }
      },
      type: list('RootCompetency'),
    });
    t.field('randomCompetency', {
      async resolve(root, argumentz, ctx) {
        try {
          return await CompetencyService.findRandomCompetency();
        } catch (error) {
          handleResolverError(error, ctx);
        }
      },
      type: 'Competency',
    });
    t.field('randomRootCompetency', {
      async resolve(root, argumentz, ctx) {
        try {
          return await CompetencyService.findRandomRootCompetency();
        } catch (error) {
          handleResolverError(error, ctx);
        }
      },
      type: 'RootCompetency',
    });
    t.field('rootCompetency', {
      args: { id: idArg() },
      async resolve(root, { id }, ctx: Context, info) {
        try {
          return await CompetencyService.findRootCompetencyById(id);
        } catch (error) {
          handleResolverError(error, ctx);
        }
      },
      type: 'RootCompetency',
    });
  },
});

export const CreateCompetencyInput = inputObjectType({
  name: 'CreateCompetencyInput',
  definition(t) {
    t.string('title');
    t.nullable.id('parentId');
  },
});

export type CreateCompetencyPayloadModel =
  | { error: UserErrorModel }
  | { competency: CompetencyModel };

export const CreateCompetencyPayload = unionType({
  name: 'CreateCompetencyPayload',
  definition(t) {
    t.members('CreateCompetencyErrorPayload', 'CreateCompetencySuccessPayload');
  },
  resolveType: (item) => {
    return 'error' in item
      ? 'CreateCompetencyErrorPayload'
      : 'CreateCompetencySuccessPayload';
  },
  sourceType: {
    export: 'CreateCompetencyPayloadModel',
    module: __filename,
  },
});

export const CreateCompetencyErrorPayload = objectType({
  name: 'CreateCompetencyErrorPayload',
  definition(t) {
    t.nonNull.field('error', { type: 'UserError' });
  },
});

export const CreateCompetencySuccessPayload = objectType({
  name: 'CreateCompetencySuccessPayload',
  definition(t) {
    t.nonNull.field('competency', { type: 'Competency' });
  },
});

export const CreateCompetency = mutationField('createCompetency', {
  type: nonNull('CreateCompetencyPayload'),
  args: {
    currentUserId: idArg(),
    data: CreateCompetencyInput,
  },
  async resolve(root, { currentUserId, data }, ctx) {
    try {
      const competency = await CompetencyService.createCompetency(data, {
        currentUserId,
      });
      return { competency };
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          error: {
            code: error.extensions.code,
            message: error.message,
            path: error.extensions.path,
          },
        };
      }
      handleResolverError(error, ctx);
    }
  },
});

export const DeleteCompetency = mutationField('deleteCompetency', {
  type: 'Competency',
  args: {
    id: idArg(),
  },
  async resolve(root, { id }, ctx) {
    return CompetencyService.deleteCompetency(id);
  },
});
