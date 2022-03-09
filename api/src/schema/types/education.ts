import {
  extendType,
  idArg,
  inputObjectType,
  list,
  mutationField,
  nonNull,
  objectType,
} from 'nexus';

import { EducationService } from '../../services/module';
import { Context } from '../context';
import { handleResolverError } from '../utils';
import { Accountable, Node } from './interfaces';

export const Education = objectType({
  name: 'Education',
  definition(t) {
    t.implements(Node);
    t.implements(Accountable);
    t.nonNull.string('title', {
      resolve: async (education, argumentz, ctx) => {
        return education.translations[0].title;
      },
    });
  },
  sourceType: {
    export: 'EducationModel',
    module: require.resolve('../../services/education'),
  },
});

export const EducationQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('allEducations', {
      async resolve(root, argumentz, ctx: Context, info) {
        try {
          return await EducationService.getAllEducations();
        } catch (error) {
          handleResolverError(error, ctx);
        }
      },
      type: nonNull(list(nonNull('Education'))),
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
    data: EducationInput,
  },
  async resolve(root, { data }, ctx) {
    try {
      return await EducationService.createEducation(data);
    } catch (error) {
      handleResolverError(error, ctx);
    }
  },
});

export const UpdateEducation = mutationField('updateEducation', {
  type: Education,
  args: {
    id: idArg(),
    data: EducationInput,
  },
  async resolve(root, { id, data }, ctx) {
    try {
      return await EducationService.updateEducation(id, data);
    } catch (error) {
      handleResolverError(error, ctx);
    }
  },
});

export const DeleteEducation = mutationField('deleteEducation', {
  type: Node,
  args: {
    id: idArg(),
  },
  async resolve(root, { id }, ctx) {
    try {
      return await EducationService.deleteEducation(id);
    } catch (error) {
      handleResolverError(error, ctx);
    }
  },
});
