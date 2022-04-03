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

import { CompetencyService } from '../../domain';
import type { CompetencyModel } from '../../domain/competency';
import {
  AppError,
  AppUnauthorizedError,
  AppValidationError,
} from '../../errors';
import { Context } from '../context';
import { UserErrorModel } from './errors';

export const Competency = interfaceType({
  name: 'Competency',
  description:
    'A competency can be an individual competence or a grouping of competences.',
  definition(t) {
    t.implements('Node');
    t.implements('Accountable');
    t.field('subCompetencies', {
      type: list(nonNull('NestedCompetency')),
      async resolve(parent, argumentz, ctx) {
        return CompetencyService.findSubCompetenciesByParentId(parent.id, ctx);
      },
    });
    t.nonNull.string('title');
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
    t.implements('Competency');
    t.nonNull.field('parent', {
      type: 'Competency',
      async resolve(parent, argumentz, ctx) {
        if (parent.parentCompetencyId == null) {
          throw new AppError(
            'expected NestedCompetency type to have a parent competency id',
          );
        }
        const parentCompetency = await CompetencyService.findCompetencyById(
          parent.parentCompetencyId,
          ctx,
        );
        if (parentCompetency == null) {
          throw new AppError(
            'expected NestedCompetency type to have a parent competency',
          );
        }
        return parentCompetency;
      },
    });
  },
  sourceType: {
    export: 'CompetencyModel',
    module: require.resolve('../../domain/source-types'),
  },
});

export const RootCompetency = objectType({
  name: 'RootCompetency',
  description: 'A competency without a parent.',
  definition(t) {
    t.implements('Competency');
    t.nonNull.field('nestedCompetencies', {
      type: list(nonNull('NestedCompetency')),
      async resolve(parent, argumentz, ctx) {
        return CompetencyService.getNestedCompetenciesByRootId(parent.id, ctx);
      },
    });
  },
  sourceType: {
    export: 'CompetencyModel',
    module: require.resolve('../../domain/source-types'),
  },
});

export const CompetencyQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.field('allRootCompetencies', {
      async resolve(root, argumentz, ctx) {
        return CompetencyService.getAllRootCompetencies(ctx);
      },
      type: list(nonNull('RootCompetency')),
    });
    t.field('competency', {
      args: { id: idArg() },
      async resolve(root, { id }, ctx: Context) {
        return CompetencyService.findCompetencyById(id, ctx);
      },
      type: 'Competency',
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
  | UserErrorModel
  | { competency: CompetencyModel };

export const CreateCompetencyPayload = unionType({
  name: 'CreateCompetencyPayload',
  definition(t) {
    t.members('UserError', 'CreateCompetencySuccessPayload');
  },
  resolveType: (item) => {
    return 'competency' in item
      ? 'CreateCompetencySuccessPayload'
      : 'UserError';
  },
  sourceType: {
    export: 'CreateCompetencyPayloadModel',
    module: __filename,
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
    data: 'CreateCompetencyInput',
  },
  async resolve(root, { data }, ctx) {
    if (ctx.userId == null) {
      throw new AppUnauthorizedError();
    }
    try {
      const competency = await CompetencyService.createCompetency(
        { title: data.title, parentId: data.parentId ?? undefined },
        ctx,
      );
      return { competency };
    } catch (error) {
      if (error instanceof AppValidationError) {
        return {
          code: error.extensions.code,
          message: error.message,
          path: error.extensions.path,
        };
      }
      throw error as Error;
    }
  },
});

export const DeleteCompetency = mutationField('deleteCompetency', {
  type: 'Competency',
  args: {
    id: idArg(),
  },
  async resolve(root, { id }, ctx) {
    return CompetencyService.deleteCompetency(id, ctx);
  },
});

export const RenameCompetencyInput = inputObjectType({
  name: 'RenameCompetencyInput',
  definition(t) {
    t.string('title');
  },
});

export type RenameCompetencyPayloadModel =
  | UserErrorModel
  | { competency: CompetencyModel };

export const RenameCompetencyPayload = unionType({
  name: 'RenameCompetencyPayload',
  definition(t) {
    t.members('UserError', 'RenameCompetencySuccessPayload');
  },
  resolveType: (item) => {
    return 'competency' in item
      ? 'RenameCompetencySuccessPayload'
      : 'UserError';
  },
  sourceType: {
    export: 'RenameCompetencyPayloadModel',
    module: __filename,
  },
});

export const RenameCompetencySuccessPayload = objectType({
  name: 'RenameCompetencySuccessPayload',
  definition(t) {
    t.nonNull.field('competency', { type: 'Competency' });
  },
});

export const RenameCompetency = mutationField('renameCompetency', {
  type: nonNull('RenameCompetencyPayload'),
  args: {
    id: idArg(),
    data: 'RenameCompetencyInput',
  },
  async resolve(root, { id, data }, ctx) {
    if (ctx.userId == null) {
      throw new AppUnauthorizedError();
    }
    try {
      const competency = await CompetencyService.updateCompetencyTranslations(
        id,
        data,
        ctx,
      );
      return { competency };
    } catch (error) {
      if (error instanceof AppValidationError) {
        return {
          code: error.extensions.code,
          message: error.message,
          path: error.extensions.path,
        };
      }
      throw error as Error;
    }
  },
});
