import type { CompetencyFrameworkModel, CompetencyModel } from '~/domain';
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
			async resolve(competency, _arguments, { inject: { competencyService } }) {
				return competencyService.findFrameworkById(competency.frameworkId);
			},
		}),
		parent: t.field({
			type: Competency,
			nullable: true,
			async resolve(competency, _arguments, { inject: { competencyService } }) {
				if (competency.parentCompetencyId == null) {
					return null;
				}
				const parentCompetency = await competencyService.findCompetencyById(
					competency.parentCompetencyId,
				);
				return parentCompetency;
			},
		}),
		subCompetencies: t.field({
			type: [Competency],
			nullable: true,
			async resolve(competency, _arguments, { inject: { competencyService } }) {
				return competencyService.findSubCompetenciesByParentId(competency.id);
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
			async resolve(framework, _arguments, { inject: { competencyService } }) {
				return competencyService.getFrameworkCompetencies(framework.id);
			},
		}),
		title: t.exposeString('title'),
	}),
});

builder.queryFields((t) => ({
	allCompetencyFrameworks: t.field({
		type: [CompetencyFramework],
		async resolve(root, _arguments, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('read', 'CompetencyFramework')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.getAllFrameworks();
		},
	}),
	allRootCompetencies: t.field({
		type: [Competency],
		async resolve(root, _arguments, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('read', 'Competency')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.getAllRootCompetencies();
		},
	}),
	competency: t.field({
		args: { id: t.arg.id() },
		nullable: true,
		type: Competency,
		errors: {
			types: [AppNotFoundError],
		},
		async resolve(root, { id }, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('read', 'Competency')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.findCompetencyById(id);
		},
	}),
	competencyFramework: t.field({
		args: { id: t.arg.id() },
		nullable: true,
		type: CompetencyFramework,
		errors: {
			types: [AppNotFoundError],
		},
		async resolve(root, { id }, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('read', 'CompetencyFramework')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.findFrameworkById(id);
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
		async resolve(root, { data }, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('create', 'CompetencyFramework')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.createCompetencyFramework({ title: data.title });
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
		async resolve(root, { data }, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('create', 'Competency')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.createNestedCompetency(data);
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
		async resolve(root, { data }, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('create', 'Competency')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.createRootCompetency(data);
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
		async resolve(root, { id }, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('delete', 'Competency')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.deleteCompetency(id);
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
		async resolve(root, { id, data }, { inject: { auth, competencyService } }) {
			if (auth.ability.cannot('update', 'Competency')) {
				throw new AppUnauthorizedError();
			}
			return competencyService.updateCompetencyTranslations(id, data);
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
		async resolve(
			root,
			{ leftCompetencyId, rightCompetencyId },
			{ inject: { auth, competencyService } },
		) {
			if (auth.ability.cannot('update', 'Competency')) {
				throw new AppUnauthorizedError();
			}
			const [left, right] = await competencyService.swapCompetencies(
				leftCompetencyId,
				rightCompetencyId,
			);
			return { left, right };
		},
	}),
);
