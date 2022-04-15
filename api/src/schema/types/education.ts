import { EducationService } from '../../domain';
import type { EducationModel } from '../../domain/education';
import builder from '../builder';
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
    async resolve(root, argumentz, ctx) {
      return EducationService.getAllEducations(ctx);
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
      return EducationService.createEducation(data, ctx);
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
      return EducationService.updateEducation(id, data, ctx);
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
      return EducationService.deleteEducation(id, ctx);
    },
  }),
);
