import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import {
  InternshipService,
  UserModel,
  InternshipModel,
  InternshipInstanceModel,
} from '~/domain';
import { sample } from '~/utils';

import builder from '../builder';
import { Course } from './course';
import { Node } from './node';
import {
  createFakeOrganisation,
  createFakeWorkplace,
  Organisation,
  OrganisationModel,
  Workplace,
  WorkplaceModel,
} from './organisation';
import { Person } from './person';

interface GraphConnection<T> {
  edges: T[];
}
interface GraphEdge<T> {
  node: T;
}

export const Internship = builder.objectRef<InternshipModel>('Internship');

export const InternshipInstance = builder.objectRef<InternshipInstanceModel>(
  'InternshipInstanceModel',
);
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
    courses: t.field({
      type: [Course],
      async resolve(parent, argumentz, ctx) {
        const courses = await InternshipService.getInternshipCourses(parent.id);
        return courses;
      },
    }),
    name: t.string({
      async resolve(parent, argumentz, ctx) {
        const courses = await InternshipService.getInternshipCourses(parent.id);
        return `Internship ${courses[0]?.name}`;
      },
    }),
  }),
});

builder.objectType(InternshipInstance, {
  name: 'InternshipInstance',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    internship: t.field({
      type: Internship,
      async resolve(parent) {
        const internship = await InternshipService.getInternshipById(
          parent.internshipId,
        );
        return internship;
      },
    }),
  }),
});

builder.queryField('myInternshipInstances', (t) =>
  t.field({
    type: [InternshipInstance],
    async resolve(parent, argumentz, ctx) {
      return InternshipService.getInternshipInstancesForUser(ctx.domain);
    },
  }),
);

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
