import { subject } from '@casl/ability';
import { faker } from '@faker-js/faker';

import {
  InternshipService,
  InternshipModel,
  InternshipInstanceModel,
  CourseService,
  InternshipPositionModel,
  OrganisationService,
  UserService,
} from '~/domain';
import { prisma } from '~/prisma';
import { cacheFakeData } from '~/schema/helpers';
import { generateFakePerson, Person } from '~/schema/types/person';

import builder from '../builder';
import { Course } from './course';
import { Node } from './node';
import { generateFakeWorkplace, Organisation, Workplace } from './organisation';

interface GraphConnection<T> {
  edges: T[];
}
interface GraphEdge<T> {
  node: T;
}

export const Internship = builder.objectRef<InternshipModel>('Internship');

export const InternshipInstance =
  builder.objectRef<InternshipInstanceModel>('InternshipInstance');
interface InternshipAppliedPositionConnectionModel
  extends GraphConnection<InternshipAppliedPositionPriorityEdgeModel> {}

export const InternshipAppliedPositionConnection =
  builder.objectRef<InternshipAppliedPositionConnectionModel>(
    'InternshipAppliedPositionConnection',
  );

export const InternshipAppliedPositionEdge = builder.interfaceRef<
  GraphEdge<InternshipPositionModel>
>('InternshipAppliedPositionEdge');

interface InternshipAppliedPositionPriorityEdgeModel
  extends GraphEdge<InternshipPositionModel> {
  priority: number;
}

export const InternshipAppliedPositionPriorityEdge =
  builder.objectRef<InternshipAppliedPositionPriorityEdgeModel>(
    'InternshipAppliedPositionPriorityEdge',
  );

export const InternshipPosition =
  builder.objectRef<InternshipPositionModel>('InternshipPosition');

builder.objectType(Internship, {
  name: 'Internship',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    availablePositions: t.field({
      type: [InternshipPosition],
      async resolve(internship, argumentz, ctx) {
        return InternshipService.getAvailablePositions(internship.id);
      },
    }),
    coordinator: t.field({
      type: Person,
      resolve(internship) {
        return cacheFakeData(
          `internship-${internship.id}-coordinator`,
          generateFakePerson,
        );
      },
    }),
    dateFrom: t.field({
      type: 'DateTime',
      async resolve(internship) {
        const [from] = await cacheFakeData(
          `internship-${internship.id}-range`,
          generateFakeRange,
        );
        return from;
      },
    }),
    dateTo: t.field({
      type: 'DateTime',
      async resolve(internship) {
        const [, to] = await cacheFakeData(
          `internship-${internship.id}-range`,
          generateFakeRange,
        );
        return to;
      },
    }),
    defaultSupervisor: t.field({
      type: Person,
      resolve(internship) {
        return cacheFakeData(
          `internship-${internship.id}-default-supervisor`,
          generateFakePerson,
        );
      },
    }),
    course: t.field({
      type: Course,
      async resolve(internship, argumentz, ctx) {
        return CourseService.getCourseById(internship.courseId);
      },
    }),
  }),
});

builder.objectType(InternshipInstance, {
  name: 'InternshipInstance',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    appliedPositions: t.field({
      type: InternshipAppliedPositionConnection,
      async resolve(instance) {
        /* eslint-disable @typescript-eslint/no-magic-numbers */
        const positions = await cacheFakeData(
          `internship-instance-${instance.id}-applied-positions`,
          async () => {
            const allPositions = await prisma.internshipPosition.findMany();
            return faker.helpers.arrayElements(
              allPositions,
              faker.mersenne.rand(3),
            );
          },
        );

        return {
          edges: positions.map((position) => ({
            node: position,
            priority: faker.mersenne.rand(3, 1),
          })),
        };
      },
    }),
    assignedPosition: t.field({
      type: InternshipPosition,
      nullable: true,
      resolve(instance) {
        /* eslint-disable @typescript-eslint/no-magic-numbers */
        return cacheFakeData(
          `internship-instance-${instance.id}-assigned-position`,
          async () => {
            return faker.mersenne.rand(100) > 90
              ? faker.helpers.arrayElement(
                  await prisma.internshipPosition.findMany(),
                )
              : null;
          },
        );
      },
    }),
    internship: t.field({
      type: Internship,
      async resolve(instance) {
        return InternshipService.getInternshipById(instance.internshipId);
      },
    }),
    student: t.field({
      type: Person,
      resolve(instance) {
        return UserService.findUserById(instance.studentId);
      },
    }),
    supervisor: t.field({
      type: Person,
      resolve(instance) {
        return cacheFakeData(
          `internship-instance-${instance.id}-supervisor`,
          generateFakePerson,
        );
      },
    }),
  }),
});

builder.queryField('internshipInstance', (t) =>
  t.field({
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    type: InternshipInstance,
    async resolve(root, { id }, ctx) {
      const instance = await InternshipService.getInternshipInstanceById(id);
      if (instance == null) {
        return instance;
      }
      return ctx.request.auth.ability.can(
        'read',
        subject('InternshipInstance', instance),
      )
        ? instance
        : null;
    },
  }),
);

builder.queryField('myInternshipInstances', (t) =>
  t.field({
    type: [InternshipInstance],
    async resolve(root, argumentz, ctx) {
      return InternshipService.getInternshipInstancesForUser(ctx.domain);
    },
  }),
);

builder.objectType(InternshipPosition, {
  name: 'InternshipPosition',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    mentor: t.field({
      type: Person,
      resolve(position) {
        return cacheFakeData(
          `internship-position-${position.id}-mentor`,
          generateFakePerson,
        );
      },
    }),
    organisation: t.field({
      type: Organisation,
      async resolve(parent) {
        const organisation = await OrganisationService.getOrganisationById(
          parent.organisationId,
        );
        return organisation;
      },
    }),
    summary: t.exposeString('summary'),
    workplace: t.field({
      type: Workplace,
      resolve(position) {
        return cacheFakeData(
          `internship-position-organisation-${position.organisationId}-workplace`,
          generateFakeWorkplace,
        );
      },
    }),
  }),
});

builder.queryField('internshipPosition', (t) =>
  t.field({
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    type: InternshipPosition,
    async resolve(root, { id }, ctx) {
      return InternshipService.getInternshipPositionById(id);
    },
  }),
);

builder.objectType(InternshipAppliedPositionConnection, {
  name: 'InternshipAppliedPositionConnection',
  fields: (t) => ({
    edges: t.expose('edges', {
      type: [InternshipAppliedPositionEdge],
    }),
  }),
});

builder.interfaceType(InternshipAppliedPositionEdge, {
  name: 'InternshipAppliedPositionEdge',
  fields: (t) => ({
    node: t.expose('node', { type: InternshipPosition }),
  }),
});

builder.objectType(InternshipAppliedPositionPriorityEdge, {
  name: 'InternshipAppliedPositionPriorityEdge',
  interfaces: [InternshipAppliedPositionEdge],
  isTypeOf(internshipAppliedPositionEdge) {
    return (
      internshipAppliedPositionEdge != null &&
      typeof internshipAppliedPositionEdge === 'object' &&
      'priority' in internshipAppliedPositionEdge
    );
  },
  fields: (t) => ({
    priority: t.exposeInt('priority'),
  }),
});

builder.mutationField('applyForPriorityInternshipPosition', (t) =>
  t.field({
    type: InternshipAppliedPositionPriorityEdge,
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

function generateFakeRange(): [Date, Date] {
  const from = generateFutureDate();
  return [from, generateFutureDate(from)];
}

function generateFutureDate(reference?: Date): Date {
  const date = faker.date.future(1, reference);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}
