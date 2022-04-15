import { CompetencyService } from '../../domain';
import type {
  CompetencyFrameworkModel,
  CompetencyModel,
} from '../../domain/competency';
import { AppInputError, AppUnauthorizedError } from '../../errors';
import builder from '../builder';
import { Accountable } from './accountable';
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
          throw new Error(
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

builder.mutationField('createCompetencyFramework', (t) =>
  t.field({
    type: CompetencyFramework,
    args: {
      data: t.arg({ type: CreateCompetencyFrameworkInput }),
    },
    errors: {
      types: [AppInputError, AppUnauthorizedError],
    },
    async resolve(root, { data }, ctx) {
      if (ctx.userId == null) {
        throw new AppUnauthorizedError('');
      }
      return CompetencyService.createCompetencyFramework(
        { title: data.title },
        ctx,
      );
    },
  }),
);

const CreateCompetencyInput = builder.inputType('CreateCompetencyInput', {
  fields: (t) => ({
    parentId: t.id({ required: false }),
    title: t.string(),
  }),
});

builder.mutationField('createCompetency', (t) =>
  t.field({
    type: Competency,
    args: {
      data: t.arg({ type: CreateCompetencyInput }),
    },
    errors: {
      types: [AppInputError],
    },
    async resolve(root, { data }, ctx) {
      if (ctx.userId == null) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.createCompetency(
        {
          parentId: data.parentId ?? undefined,
          title: data.title,
        },
        ctx,
      );
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
    type: Competency,
    args: {
      data: t.arg({ type: CreateNestedCompetencyInput }),
    },
    errors: {
      types: [AppInputError, AppUnauthorizedError],
    },
    async resolve(root, { data }, ctx) {
      if (ctx.userId == null) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.createNestedCompetency(data, ctx);
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
    type: Competency,
    args: {
      data: t.arg({ type: CreateRootCompetencyInput }),
    },
    errors: {
      types: [AppInputError, AppUnauthorizedError],
    },
    async resolve(root, { data }, ctx) {
      if (ctx.userId == null) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.createRootCompetency(data, ctx);
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

const RenameCompetencyInput = builder.inputType('RenameCompetencyInput', {
  fields: (t) => ({
    title: t.string(),
  }),
});

builder.mutationField('renameCompetency', (t) =>
  t.field({
    type: Competency,
    args: {
      id: t.arg.id(),
      data: t.arg({ type: RenameCompetencyInput }),
    },
    errors: {
      types: [AppInputError, AppUnauthorizedError],
    },
    async resolve(root, { id, data }, ctx) {
      if (ctx.userId == null) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.updateCompetencyTranslations(id, data, ctx);
    },
  }),
);
