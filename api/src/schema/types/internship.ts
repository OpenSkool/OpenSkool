import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import { UserModel } from '~/domain';
import { prisma } from '~/prisma';
import { random, sample, sampleMany, times } from '~/utils';

import builder from '../builder';
import { createFakeCourse, CourseModel } from './course';
import { Node } from './node';
import {
  createFakeOrganisation,
  createFakeWorkplace,
  Organisation,
  OrganisationModel,
  Workplace,
  WorkplaceModel,
} from './organisation';
import { createFakePerson, Person } from './person';

/* eslint-disable @typescript-eslint/no-magic-numbers */

interface InternshipModel {
  id: string;
  applications: InternshipApplicationModel[];
  course: CourseModel;
  coordinator: UserModel;
  dateFrom: Date;
  dateTo: Date;
  defaultSupervisor: UserModel;
  positions: InternshipPositionModel[];
  students: UserModel[];
}

export function createFakeInternship({
  positions,
  users,
}: {
  positions: InternshipPositionModel[];
  users: UserModel[];
}): InternshipModel {
  const dateFrom = faker.date.future();
  const dateTo = faker.date.future(1, dateFrom);
  return {
    id: cuid(),
    applications: times(3, () =>
      createFakeInternshipApplication({ positions, users }),
    ),
    course: createFakeCourse(),
    defaultSupervisor: createFakePerson(),
    coordinator: createFakePerson(),
    dateFrom,
    dateTo,
    positions: sampleMany(10, positions),
    students: sampleMany(12, users),
  };
}

export const Internship = builder.objectRef<InternshipModel>('Internship');

interface InternshipPositionModel {
  id: string;
  description: string;
  mentor: UserModel;
  organisation: OrganisationModel;
  workplace: WorkplaceModel;
}

export function createFakeInternshipPosition({
  users,
}: {
  users: UserModel[];
}): InternshipPositionModel {
  return {
    id: cuid(),
    description: faker.lorem.paragraph(),
    mentor: sample(users),
    organisation: createFakeOrganisation(),
    workplace: createFakeWorkplace(),
  };
}

export const InternshipPosition =
  builder.objectRef<InternshipPositionModel>('InternshipPosition');

interface InternshipApplicationModel {
  id: string;
  position: InternshipPositionModel;
  priority: number;
  student: UserModel;
  supervisor: UserModel;
}

export function createFakeInternshipApplication({
  positions,
  users,
}: {
  positions: InternshipPositionModel[];
  users: UserModel[];
}): InternshipApplicationModel {
  return {
    id: cuid(),
    position: sample(positions),
    priority: 1 + random(3),
    student: sample(users),
    supervisor: sample(users),
  };
}

export const InternshipApplication =
  builder.objectRef<InternshipApplicationModel>('InternshipApplication');

builder.objectType(Internship, {
  name: 'Internship',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    applications: t.expose('applications', { type: [InternshipApplication] }),
    coordinator: t.expose('coordinator', { type: Person }),
    dateFrom: t.expose('dateFrom', { type: 'DateTime' }),
    dateTo: t.expose('dateTo', { type: 'DateTime' }),
    defaultSupervisor: t.expose('defaultSupervisor', { type: Person }),
    name: t.string({
      resolve(internship) {
        return `Internship ${internship.course.name}`;
      },
    }),
    positions: t.expose('positions', { type: [InternshipPosition] }),
    students: t.expose('students', { type: [Person] }),
  }),
});

builder.objectType(InternshipApplication, {
  name: 'InternshipApplication',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    position: t.expose('position', { type: InternshipPosition }),
    priority: t.exposeInt('priority'),
    student: t.expose('student', { type: Person }),
    supervisor: t.expose('supervisor', { type: Person }),
  }),
});

builder.objectType(InternshipPosition, {
  name: 'InternshipPosition',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
    mentor: t.expose('mentor', { type: Person }),
    organisation: t.expose('organisation', { type: Organisation }),
    workplace: t.expose('workplace', { type: Workplace }),
  }),
});

const users = await prisma.user.findMany();
while (users.length < 50) {
  users.push(createFakePerson());
}
const POSITIONS = times(50, () => createFakeInternshipPosition({ users }));
const INTERNSHIPS = times(3, () =>
  createFakeInternship({ positions: POSITIONS, users }),
);

builder.queryField('myInternships', (t) =>
  t.field({
    type: [Internship],
    resolve() {
      return INTERNSHIPS;
    },
  }),
);

builder.mutationField('applyForInternPosition', (t) =>
  t.field({
    type: InternshipPosition,
    args: {
      id: t.arg.id(),
      priority: t.arg.int(),
    },
    resolve() {
      throw new Error('TODO mutate apply for intern position');
    },
  }),
);
