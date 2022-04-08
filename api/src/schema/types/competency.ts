import {
  extendType,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
  unionType,
} from 'nexus';

import { CompetencyService } from '../../domain';
import type {
  CompetencyFrameworkModel,
  CompetencyModel,
} from '../../domain/competency';
import {
  AppError,
  AppUnauthorizedError,
  AppValidationError,
} from '../../errors';
import { Context } from '../context';
import { BaseErrorModel } from './errors';

export const CompetencyFramework = objectType({
  name: 'CompetencyFramework',
  definition(t) {
    t.implements('Node');
    t.nonNull.string('title');
    t.nonNull.field('competencies', {
      type: list(nonNull('Competency')),
      async resolve(parent, argumentz, ctx) {
        return CompetencyService.getFrameworkCompetencies(parent.id, ctx);
      },
    });
  },
  sourceType: {
    export: 'CompetencyFrameworkModel',
    module: require.resolve('../../domain/source-types'),
  },
});

export const Competency = objectType({
  name: 'Competency',
  description:
    'A competency can be an individual competence or a grouping of competences.',
  definition(t) {
    t.implements('Node');
    t.implements('Accountable');
    t.nonNull.field('competencyFramework', {
      type: 'CompetencyFramework',
      async resolve(parent, argumentz, ctx) {
        const framework = await CompetencyService.findFrameworkById(
          parent.id,
          ctx,
        );
        if (framework == null) {
          throw new Error('expected framework to be found');
        }
        return framework;
      },
    });
    t.field('parent', {
      type: 'Competency',
      async resolve(parent, argumentz, ctx) {
        if (parent.parentCompetencyId == null) {
          return null;
        }
        const parentCompetency = await CompetencyService.findCompetencyById(
          parent.parentCompetencyId,
          ctx,
        );
        if (parentCompetency == null) {
          throw new AppError(
            'expected Competency type to have a parent competency',
          );
        }
        return parentCompetency;
      },
    });
    t.field('subCompetencies', {
      type: list(nonNull('Competency')),
      async resolve(parent, argumentz, ctx) {
        return CompetencyService.findSubCompetenciesByParentId(parent.id, ctx);
      },
    });
    t.nonNull.string('title');
  },
  sourceType: {
    export: 'CompetencyModel',
    module: require.resolve('../../domain/source-types'),
  },
});

export const CompetencyQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.field('allCompetencyFrameworks', {
      async resolve(root, argumentz, ctx) {
        return CompetencyService.getAllFrameworks(ctx);
      },
      type: list(nonNull('CompetencyFramework')),
    });
    t.nonNull.field('allRootCompetencies', {
      async resolve(root, argumentz, ctx) {
        return CompetencyService.getAllRootCompetencies(ctx);
      },
      type: list(nonNull('Competency')),
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

export const CreateCompetencyFrameworkInput = inputObjectType({
  name: 'CreateCompetencyFrameworkInput',
  definition(t) {
    t.string('title');
  },
});

export type CreateCompetencyFrameworkPayloadModel =
  | BaseErrorModel
  | { competencyFramework: CompetencyFrameworkModel };

export const CreateCompetencyFrameworkPayload = unionType({
  name: 'CreateCompetencyFrameworkPayload',
  definition(t) {
    t.members('InputError', 'CreateCompetencyFrameworkSuccessPayload');
  },
  resolveType: (item) => {
    return 'competencyFramework' in item
      ? 'CreateCompetencyFrameworkSuccessPayload'
      : 'InputError';
  },
  sourceType: {
    export: 'CreateCompetencyFrameworkPayloadModel',
    module: __filename,
  },
});

export const CreateCompetencyFrameworkSuccessPayload = objectType({
  name: 'CreateCompetencyFrameworkSuccessPayload',
  definition(t) {
    t.nonNull.field('competencyFramework', { type: 'CompetencyFramework' });
  },
});

export const CreateCompetencyFramework = mutationField(
  'createCompetencyFramework',
  {
    type: nonNull('CreateCompetencyFrameworkPayload'),
    args: {
      data: 'CreateCompetencyFrameworkInput',
    },
    async resolve(root, { data }, ctx) {
      if (ctx.userId == null) {
        throw new AppUnauthorizedError();
      }
      try {
        const competencyFramework =
          await CompetencyService.createCompetencyFramework(
            { title: data.title },
            ctx,
          );
        return { competencyFramework };
      } catch (error) {
        if (error instanceof AppValidationError) {
          return {
            __typename: 'InputError',
            code: error.extensions.code,
            message: error.message,
            path: error.extensions.path,
          };
        }
        throw error as Error;
      }
    },
  },
);

export const CreateNestedCompetencyInput = inputObjectType({
  name: 'CreateNestedCompetencyInput',
  definition(t) {
    t.string('title');
    t.id('parentId');
  },
});

export const CreateRootCompetencyInput = inputObjectType({
  name: 'CreateRootCompetencyInput',
  definition(t) {
    t.string('title');
    t.id('frameworkId');
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
  | BaseErrorModel
  | { competency: CompetencyModel };

export const CreateCompetencyPayload = unionType({
  name: 'CreateCompetencyPayload',
  definition(t) {
    t.members('InputError', 'CreateCompetencySuccessPayload');
  },
  resolveType: (item) => {
    return 'competency' in item
      ? 'CreateCompetencySuccessPayload'
      : 'InputError';
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
        {
          parentId: data.parentId ?? undefined,
          title: data.title,
        },
        ctx,
      );

      return { competency };
    } catch (error) {
      if (error instanceof AppValidationError) {
        return {
          __typename: 'InputError',
          code: error.extensions.code,
          message: error.message,
          path: error.extensions.path,
        };
      }
      throw error as Error;
    }
  },
});

export const CreateNestedCompetency = mutationField('createNestedCompetency', {
  type: nonNull('CreateCompetencyPayload'),
  args: {
    data: 'CreateNestedCompetencyInput',
  },
  async resolve(root, { data }, ctx) {
    if (ctx.userId == null) {
      throw new AppUnauthorizedError();
    }
    try {
      const competency = await CompetencyService.createNestedCompetency(
        data,
        ctx,
      );

      return { competency };
    } catch (error) {
      if (error instanceof AppValidationError) {
        return {
          __typename: 'InputError',
          code: error.extensions.code,
          message: error.message,
          path: error.extensions.path,
        };
      }
      throw error as Error;
    }
  },
});

export const CreateRootCompetency = mutationField('createRootCompetency', {
  type: nonNull('CreateCompetencyPayload'),
  args: {
    data: 'CreateRootCompetencyInput',
  },
  async resolve(root, { data }, ctx) {
    if (ctx.userId == null) {
      throw new AppUnauthorizedError();
    }
    try {
      const competency = await CompetencyService.createRootCompetency(
        data,
        ctx,
      );
      return { competency };
    } catch (error) {
      if (error instanceof AppValidationError) {
        return {
          __typename: 'InputError',
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
  | BaseErrorModel
  | { competency: CompetencyModel };

export const RenameCompetencyPayload = unionType({
  name: 'RenameCompetencyPayload',
  definition(t) {
    t.members('InputError', 'RenameCompetencySuccessPayload');
  },
  resolveType: (item) => {
    return 'competency' in item
      ? 'RenameCompetencySuccessPayload'
      : 'InputError';
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
          __typename: 'InputError',
          code: error.extensions.code,
          message: error.message,
          path: error.extensions.path,
        };
      }
      throw error as Error;
    }
  },
});
