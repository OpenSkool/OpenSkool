import {
  CompetencyFrameworkModel,
  CompetencyModel,
  CompetencyService,
} from '~/domain';
import {
  AppInputError,
  AppNotFoundError,
  AppUnauthorizedError,
} from '~/errors';
import builder from '~/schema/builder';

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
    framework: t.field({
      type: CompetencyFramework,
      async resolve(parent, argumentz, ctx) {
        const framework = await CompetencyService.findFrameworkById(
          parent.frameworkId,
          ctx.domain,
        );
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
          ctx.domain,
        );
        return parentCompetency;
      },
    }),
    subCompetencies: t.field({
      type: [Competency],
      nullable: true,
      async resolve(parent, argumentz, ctx) {
        return CompetencyService.findSubCompetenciesByParentId(
          parent.id,
          ctx.domain,
        );
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
        return CompetencyService.getFrameworkCompetencies(
          parent.id,
          ctx.domain,
        );
      },
    }),
    title: t.exposeString('title'),
  }),
});

builder.queryFields((t) => ({
  allCompetencyFrameworks: t.field({
    type: [CompetencyFramework],
    async resolve(root, argumentz, ctx) {
      if (ctx.request.auth.ability.cannot('read', 'CompetencyFramework')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.getAllFrameworks(ctx.domain);
    },
  }),
  allRootCompetencies: t.field({
    type: [Competency],
    async resolve(root, { id }, ctx) {
      if (ctx.request.auth.ability.cannot('read', 'Competency')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.getAllRootCompetencies(ctx.domain);
    },
  }),
  competency: t.field({
    args: { id: t.arg.id() },
    nullable: true,
    type: Competency,
    errors: {
      types: [AppNotFoundError],
    },
    async resolve(root, { id }, ctx) {
      if (ctx.request.auth.ability.cannot('read', 'Competency')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.findCompetencyById(id, ctx.domain);
    },
  }),
  competencyFramework: t.field({
    args: { id: t.arg.id() },
    nullable: true,
    type: CompetencyFramework,
    errors: {
      types: [AppNotFoundError],
    },
    async resolve(root, { id }, ctx) {
      if (ctx.request.auth.ability.cannot('read', 'CompetencyFramework')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.findFrameworkById(id, ctx.domain);
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
      if (ctx.request.auth.ability.cannot('create', 'CompetencyFramework')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.createCompetencyFramework(
        { title: data.title },
        ctx.domain,
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
      types: [AppInputError, AppNotFoundError, AppUnauthorizedError],
    },
    async resolve(root, { data }, ctx) {
      if (ctx.request.auth.ability.cannot('create', 'Competency')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.createNestedCompetency(data, ctx.domain);
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
      types: [AppInputError, AppNotFoundError, AppUnauthorizedError],
    },
    async resolve(root, { data }, ctx) {
      if (ctx.request.auth.ability.cannot('create', 'Competency')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.createRootCompetency(data, ctx.domain);
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
    errors: {
      types: [AppNotFoundError, AppUnauthorizedError],
    },
    async resolve(root, { id }, ctx) {
      if (ctx.request.auth.ability.cannot('delete', 'Competency')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.deleteCompetency(id, ctx.domain);
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
      types: [AppInputError, AppNotFoundError, AppUnauthorizedError],
    },
    async resolve(root, { id, data }, ctx) {
      if (ctx.request.auth.ability.cannot('update', 'Competency')) {
        throw new AppUnauthorizedError();
      }
      return CompetencyService.updateCompetencyTranslations(
        id,
        data,
        ctx.domain,
      );
    },
  }),
);

export const MutationSwapCompetenciesSuccessData = builder.objectRef<{
  left: CompetencyModel;
  right: CompetencyModel;
}>('MutationSwapCompetenciesSuccessData');

builder.objectType(MutationSwapCompetenciesSuccessData, {
  name: 'MutationSwapCompetenciesSuccessData',
  fields: (t) => ({
    left: t.expose('left', { type: Competency }),
    right: t.expose('right', { type: Competency }),
  }),
});

builder.mutationField('swapCompetencies', (t) =>
  t.field({
    type: MutationSwapCompetenciesSuccessData,
    args: {
      leftCompetencyId: t.arg.id(),
      rightCompetencyId: t.arg.id(),
    },
    errors: {
      types: [AppInputError, AppNotFoundError, AppUnauthorizedError],
    },
    async resolve(root, { leftCompetencyId, rightCompetencyId }, ctx) {
      if (ctx.request.auth.ability.cannot('update', 'Competency')) {
        throw new AppUnauthorizedError();
      }
      const [left, right] = await CompetencyService.swapCompetencies(
        leftCompetencyId,
        rightCompetencyId,
        ctx.domain,
      );
      return { left, right };
    },
  }),
);
