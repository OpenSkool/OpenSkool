import { CourseModel } from '~/domain';

import builder from '../builder';
import { Node } from './node';

export const Course = builder.objectRef<CourseModel>('Course');

builder.objectType(Course, {
  name: 'Course',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
});
