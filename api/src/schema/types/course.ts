import cuid from 'cuid';

import { sample } from '~/utils';

import builder from '../builder';
import { Node } from './node';

export interface CourseModel {
  id: string;
  name: string;
}

const COURSE_NAMES = [
  'Chemistry',
  'Economics',
  'Electricity',
  'Fashion',
  'Informatics',
  'Math',
  'Mechanics',
  'Photography',
];

export function createFakeCourse(): CourseModel {
  return {
    id: cuid(),
    name: sample(COURSE_NAMES),
  };
}

export const Course = builder.objectRef<CourseModel>('Course');

builder.objectType(Course, {
  name: 'Course',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
});
