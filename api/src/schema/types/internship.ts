import { faker } from '@faker-js/faker';
import cuid from 'cuid';
import pMemoize from 'p-memoize';

import { UserModel } from '~/domain';
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
import { createFakePerson, getFakeUsers, Person } from './person';

/* eslint-disable @typescript-eslint/no-magic-numbers */

interface GraphConnection<T> {
  edges: T[];
}

interface GraphEdge<T> {
  node: T;
}

interface InternshipModel {
  id: string;
  availablePositions: InternshipPositionModel[];
  course: CourseModel;
  coordinator: UserModel;
  dateFrom: Date;
  dateTo: Date;
  defaultSupervisor: UserModel;
}

export const Internship = builder.objectRef<InternshipModel>('Internship');

function createFakeInternship({
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
    availablePositions: sampleMany(random(20), positions),
    coordinator: createFakePerson(),
    course: createFakeCourse(),
    defaultSupervisor: createFakePerson(),
    dateFrom,
    dateTo,
  };
}

interface InternshipInstanceModel {
  id: string;
  chosenPositions: InternshipChosenPositionConnectionModel;
  finalPosition?: InternshipPositionModel;
  internship: InternshipModel;
  student: UserModel;
  supervisor: UserModel;
}

export const InternshipInstance = builder.objectRef<InternshipInstanceModel>(
  'InternshipInstanceModel',
);

function createFakeInternshipInstance({
  internship,
  users,
}: {
  internship: InternshipModel;
  users: UserModel[];
}): InternshipInstanceModel {
  const chosenPositions = sampleMany(3, internship.availablePositions);
  const priorities = Array.from({ length: chosenPositions.length }).map(
    (_, index) => index + 1,
  );
  return {
    id: cuid(),
    chosenPositions: {
      edges: chosenPositions.map(
        (position): InternshipChosenPositionPriorityEdgeModel => {
          const [priority] =
            priorities.length === 1
              ? priorities
              : priorities.splice(random(priorities.length), 1);
          return {
            node: position,
            priority: priority as number,
          };
        },
      ),
    },
    finalPosition: random(2) === 0 ? sample(chosenPositions) : undefined,
    internship,
    student: sample(users),
    supervisor: createFakePerson(),
  };
}

interface InternshipChosenPositionConnectionModel
  extends GraphConnection<InternshipChosenPositionPriorityEdgeModel> {}

export const InternshipChosenPositionConnection =
  builder.objectRef<InternshipChosenPositionConnectionModel>(
    'InternshipChosenPositionConnection',
  );

export const InternshipChosenPositionEdge = builder.interfaceRef<
  GraphEdge<InternshipPositionModel>
>('InternshipChosenPositionEdge');

interface InternshipChosenPositionPriorityEdgeModel
  extends GraphEdge<InternshipPositionModel> {
  priority: number;
}

export const InternshipChosenPositionPriorityEdge =
  builder.objectRef<InternshipChosenPositionPriorityEdgeModel>(
    'InternshipChosenPositionPriorityEdge',
  );

interface InternshipPositionModel {
  id: string;
  dateFrom: Date;
  dateTo: Date;
  description: string;
  mentor: UserModel;
  organisation: OrganisationModel;
  workplace: WorkplaceModel;
}

export async function createFakeInternshipPosition({
  users,
}: {
  users: UserModel[];
}): Promise<InternshipPositionModel> {
  const dateFrom = faker.date.future();
  const dateTo = faker.date.future(1, dateFrom);
  return {
    id: cuid(),
    dateFrom,
    dateTo,
    description: faker.lorem.paragraph(),
    mentor: sample(users),
    organisation: await createFakeOrganisation(),
    workplace: createFakeWorkplace(),
  };
}

export const InternshipPosition =
  builder.objectRef<InternshipPositionModel>('InternshipPosition');

builder.objectType(Internship, {
  name: 'Internship',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    availablePositions: t.expose('availablePositions', {
      type: [InternshipPosition],
    }),
    coordinator: t.expose('coordinator', { type: Person }),
    dateFrom: t.expose('dateFrom', { type: 'DateTime' }),
    dateTo: t.expose('dateTo', { type: 'DateTime' }),
    defaultSupervisor: t.expose('defaultSupervisor', { type: Person }),
    name: t.string({
      resolve(internship) {
        return `Internship ${internship.course.name}`;
      },
    }),
  }),
});

builder.objectType(InternshipInstance, {
  name: 'InternshipInstance',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    finalPosition: t.expose('finalPosition', {
      nullable: true,
      type: InternshipPosition,
    }),
    internship: t.expose('internship', { type: Internship }),
    chosenPositions: t.expose('chosenPositions', {
      type: InternshipChosenPositionConnection,
    }),
    student: t.expose('student', { type: Person }),
    supervisor: t.expose('supervisor', { type: Person }),
  }),
});

builder.objectType(InternshipChosenPositionConnection, {
  name: 'InternshipChosenPositionConnection',
  fields: (t) => ({
    edges: t.expose('edges', {
      type: [InternshipChosenPositionEdge],
    }),
  }),
});

builder.interfaceType(InternshipChosenPositionEdge, {
  name: 'InternshipChosenPositionEdge',
  fields: (t) => ({
    node: t.expose('node', { type: InternshipPosition }),
  }),
});

builder.objectType(InternshipChosenPositionPriorityEdge, {
  name: 'InternshipChosenPositionPriorityEdge',
  interfaces: [InternshipChosenPositionEdge],
  isTypeOf(internshipChosenPositionEdge) {
    return (
      internshipChosenPositionEdge != null &&
      typeof internshipChosenPositionEdge === 'object' &&
      'priority' in internshipChosenPositionEdge
    );
  },
  fields: (t) => ({
    priority: t.exposeInt('priority'),
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

const getFakeInternshipInstances = pMemoize(
  async (): Promise<InternshipInstanceModel[]> => {
    const users = await getFakeUsers();
    const positions = await Promise.all(
      times(100, () => createFakeInternshipPosition({ users })),
    );
    const internships = times(3, () =>
      createFakeInternship({ positions, users }),
    );
    return times(3, () =>
      createFakeInternshipInstance({ internship: sample(internships), users }),
    );
  },
);

builder.queryField('myInternshipInstances', (t) =>
  t.field({
    type: [InternshipInstance],
    async resolve() {
      return getFakeInternshipInstances();
    },
  }),
);

builder.mutationField('applyForPriorityInternshipPosition', (t) =>
  t.field({
    type: InternshipChosenPositionPriorityEdge,
    args: {
      instanceId: t.arg.id(),
      positionId: t.arg.id(),
      priority: t.arg.int(),
    },
    resolve() {
      throw new Error('TODO mutate apply for intern position');
    },
  }),
);
