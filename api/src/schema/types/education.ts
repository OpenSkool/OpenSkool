import {
  extendType,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
} from 'nexus';

import { EducationService } from '../../domain';
import { Context } from '../context';
import { getLocalizedData } from '../helpers';

export const Education = objectType({
  name: 'Education',
  definition(t) {
    t.implements('Node');
    t.implements('Accountable');
    t.nonNull.string('title', {
      resolve: async (education, argumentz, ctx) => {
        return getLocalizedData(
          'Education',
          education.translations,
          'title',
          ctx,
        );
      },
    });
  },
  sourceType: {
    export: 'EducationModel',
    module: require.resolve('../../domain/source-types'),
  },
});

export const EducationQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.field('allEducations', {
      type: list(nonNull('Education')),
      async resolve(root, argumentz, ctx: Context, info) {
        return EducationService.getAllEducations(ctx);
      },
    });
  },
});

export const EducationInput = inputObjectType({
  name: 'EducationInput',
  definition(t) {
    t.string('title');
  },
});

export const CreateEducation = mutationField('createEducation', {
  type: Education,
  args: {
    data: 'EducationInput',
  },
  async resolve(root, { data }, ctx) {
    return EducationService.createEducation(data, ctx);
  },
});

export const UpdateEducation = mutationField('updateEducation', {
  type: Education,
  args: {
    id: idArg(),
    data: 'EducationInput',
  },
  async resolve(root, { id, data }, ctx) {
    return EducationService.updateEducation(id, data, ctx);
  },
});

export const DeleteEducation = mutationField('deleteEducation', {
  type: 'Education',
  args: {
    id: idArg(),
  },
  async resolve(root, { id }, ctx) {
    return EducationService.deleteEducation(id);
  },
});
