import type { EducationModel } from '~/domain';
import builder from '~/schema/builder';

import { Accountable } from './accountable';
import { Node } from './node';

export const Education = builder.objectRef<EducationModel>('Education');

builder.objectType(Education, {
	name: 'Education',
	interfaces: [Accountable, Node],
	fields: (t) => ({
		title: t.exposeString('title'),
	}),
});

builder.queryField('allEducations', (t) =>
	t.field({
		type: [Education],
		async resolve(root, _arguments, ctx) {
			const educationService = ctx.request.diScope.resolve('educationService');
			return educationService.getAllEducations();
		},
	}),
);

const EducationInput = builder.inputType('EducationInput', {
	fields: (t) => ({
		title: t.string(),
	}),
});

builder.mutationField('createEducation', (t) =>
	t.field({
		type: Education,
		args: {
			data: t.arg({ type: EducationInput }),
		},
		errors: {},
		async resolve(root, { data }, ctx) {
			const educationService = ctx.request.diScope.resolve('educationService');
			return educationService.createEducation(data);
		},
	}),
);

builder.mutationField('updateEducation', (t) =>
	t.field({
		type: Education,
		args: {
			id: t.arg.id(),
			data: t.arg({ type: EducationInput }),
		},
		errors: {},
		async resolve(root, { id, data }, ctx) {
			const educationService = ctx.request.diScope.resolve('educationService');
			return educationService.updateEducation(id, data);
		},
	}),
);

builder.mutationField('deleteEducation', (t) =>
	t.field({
		type: Education,
		args: {
			id: t.arg.id(),
		},
		errors: {},
		async resolve(root, { id }, ctx) {
			const educationService = ctx.request.diScope.resolve('educationService');
			return educationService.deleteEducation(id);
		},
	}),
);
