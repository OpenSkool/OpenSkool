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
import builder from '../builder';
import { Accountable } from './accountable';
import { InputError } from './errors';
import { Node } from './node';

export const Competency = builder.objectRef<CompetencyModel>('Competency');

export const CompetencyFramework = builder.objectRef<CompetencyFrameworkModel>(
  'CompetencyFramework',
);

builder.objectType(Competency, {
  name: 'Competency',
  description:
    'A competency can be an individual competence or a grouping of competences.',
  interfaces: [Accountable, Node],
  fields: (t) => ({
    competencyFramework: t.field({
      type: CompetencyFramework,
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
    }),
    parent: t.field({
      type: Competency,
      nullable: true,
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
    }),
    subCompetencies: t.field({
      type: [Competency],
      nullable: true,
      async resolve(parent, argumentz, ctx) {
        return CompetencyService.findSubCompetenciesByParentId(parent.id, ctx);
      },
    }),
    title: t.exposeString('title'),
  }),
});

builder.objectType(CompetencyFramework, {
  name: 'CompetencyFramework',
  interfaces: [Node],
  fields: (t) => ({
    competencies: t.field({
      type: [Competency],
      async resolve(parent, argumentz, ctx) {
        return CompetencyService.getFrameworkCompetencies(parent.id, ctx);
      },
    }),
    title: t.exposeString('title'),
  }),
});

builder.queryFields((t) => ({
  allCompetencyFrameworks: t.field({
    type: [CompetencyFramework],
    async resolve(root, argumentz, ctx) {
      return CompetencyService.getAllFrameworks(ctx);
    },
  }),
  allRootCompetencies: t.field({
    type: [Competency],
    async resolve(root, { id }, ctx) {
      return CompetencyService.getAllRootCompetencies(ctx);
    },
  }),
  competency: t.field({
    args: { id: t.arg.id() },
    nullable: true,
    type: Competency,
    async resolve(root, { id }, ctx) {
      return CompetencyService.findCompetencyById(id, ctx);
    },
  }),
}));

const CreateCompetencyFrameworkInput = builder.inputType(
  'CreateCompetencyFrameworkInput',
  {
    fields: (t) => ({
      title: t.string(),
    }),
  },
);

const CreateCompetencyFrameworkSuccessPayload = builder.objectRef<{
  competencyFramework: CompetencyFrameworkModel;
}>('CreateCompetencyFrameworkSuccessPayload');

builder.objectType(CreateCompetencyFrameworkSuccessPayload, {
  fields: (t) => ({
    competencyFramework: t.expose('competencyFramework', {
      type: CompetencyFramework,
    }),
  }),
});

const CreateCompetencyFrameworkPayload = builder.unionType(
  'CreateCompetencyFrameworkPayload',
  {
    types: [InputError, CreateCompetencyFrameworkSuccessPayload],
    resolveType: (item) => {
      return 'competencyFramework' in item
        ? 'CreateCompetencyFrameworkSuccessPayload'
        : 'InputError';
    },
  },
);

builder.mutationField('createCompetencyFramework', (t) =>
  t.field({
    type: CreateCompetencyFrameworkPayload,
    args: {
      data: t.arg({ type: CreateCompetencyFrameworkInput }),
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
  }),
);

const CreateCompetencySuccessPayload = builder.objectRef<{
  competency: CompetencyModel;
}>('CreateCompetencySuccessPayload');

builder.objectType(CreateCompetencySuccessPayload, {
  fields: (t) => ({
    competency: t.expose('competency', {
      type: Competency,
    }),
  }),
});

const CreateCompetencyPayload = builder.unionType('CreateCompetencyPayload', {
  types: [InputError, CreateCompetencySuccessPayload],
  resolveType: (item) => {
    return 'competency' in item
      ? 'CreateCompetencySuccessPayload'
      : 'InputError';
  },
});

const CreateCompetencyInput = builder.inputType('CreateCompetencyInput', {
  fields: (t) => ({
    parentId: t.id({ required: false }),
    title: t.string(),
  }),
});

builder.mutationField('createCompetency', (t) =>
  t.field({
    type: CreateCompetencyPayload,
    args: {
      data: t.arg({ type: CreateCompetencyInput }),
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
  }),
);

const CreateNestedCompetencyInput = builder.inputType(
  'CreateNestedCompetencyInput',
  {
    fields: (t) => ({
      parentId: t.id(),
      title: t.string(),
    }),
  },
);

builder.mutationField('createNestedCompetency', (t) =>
  t.field({
    type: CreateCompetencyPayload,
    args: {
      data: t.arg({ type: CreateNestedCompetencyInput }),
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
  }),
);

const CreateRootCompetencyInput = builder.inputType(
  'CreateRootCompetencyInput',
  {
    fields: (t) => ({
      frameworkId: t.id(),
      title: t.string(),
    }),
  },
);

builder.mutationField('createRootCompetency', (t) =>
  t.field({
    type: CreateCompetencyPayload,
    args: {
      data: t.arg({ type: CreateRootCompetencyInput }),
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
  }),
);

builder.mutationField('deleteCompetency', (t) =>
  t.field({
    type: Competency,
    nullable: true,
    args: {
      id: t.arg.id(),
    },
    async resolve(root, { id }, ctx) {
      return CompetencyService.deleteCompetency(id, ctx);
    },
  }),
);

const RenameCompetencySuccessPayload = builder.objectRef<{
  competency: CompetencyModel;
}>('RenameCompetencySuccessPayload');

builder.objectType(RenameCompetencySuccessPayload, {
  fields: (t) => ({
    competency: t.expose('competency', { type: Competency }),
  }),
});

const RenameCompetencyPayload = builder.unionType('RenameCompetencyPayload', {
  types: [InputError, RenameCompetencySuccessPayload],
  resolveType: (item) => {
    return 'competency' in item
      ? 'RenameCompetencySuccessPayload'
      : 'InputError';
  },
});

const RenameCompetencyInput = builder.inputType('RenameCompetencyInput', {
  fields: (t) => ({
    title: t.string(),
  }),
});

builder.mutationField('renameCompetency', (t) =>
  t.field({
    type: RenameCompetencyPayload,
    args: {
      id: t.arg.id(),
      data: t.arg({ type: RenameCompetencyInput }),
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
  }),
);
