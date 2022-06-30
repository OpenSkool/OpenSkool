import { subject } from '@casl/ability';
import { faker } from '@faker-js/faker';
import { InternshipPosition as InternshipPositionModel } from '@prisma/client';

import { EducationService, UserService } from '~/domain';
import { prisma } from '~/prisma';
import builder from '~/schema/builder';
import { cacheFakeData } from '~/schema/helpers';
import { Course } from '~/types/course';
import { Education } from '~/types/education';
import { generateFakePerson, Person } from '~/types/person';

import { Node } from './node';
import { generateFakeWorkplace, Workplace } from './organisation';

interface GraphConnection<T> {
  edges: T[];
}

interface GraphEdge<T> {
  node: T;
}

export const InternshipAppliedPositionConnection = builder.objectRef<
  GraphConnection<InternshipAppliedPositionPriorityEdgeModel>
>('InternshipAppliedPositionConnection');

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

export const Internship = builder.prismaObject('Internship', {
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    availablePositions: t.relation('availablePositions'),
    coordinator: t.field({
      type: Person,
      resolve(internship) {
        return cacheFakeData(
          `internship-${internship.id}-coordinator`,
          generateFakePerson,
        );
      },
    }),
    course: t.relation('course', { type: Course }),
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
    descriptionLong: t.exposeString('descriptionLong'),
    descriptionShort: t.exposeString('descriptionShort'),
    education: t.field({
      type: Education,
      resolve(internship, argumentz, ctx) {
        return EducationService.getEducationById(
          internship.educationId,
          ctx.domain,
        );
      },
    }),
    title: t.exposeString('title'),
  }),
});

const InternshipInstance = builder.prismaObject('InternshipInstance', {
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    appliedPositions: t.field({
      type: InternshipAppliedPositionConnection,
      async resolve(instance) {
        /* eslint-disable @typescript-eslint/no-magic-numbers */
        const positions = await prisma.internshipInstance
          .findUnique({ where: { id: instance.id } })
          .appliedPositions();
        return {
          edges: positions.map((position) => ({
            node: position,
            priority: faker.mersenne.rand(3, 1),
          })),
        };
      },
    }),
    assignedPosition: t.relation('assignedPosition', { nullable: true }),
    internship: t.relation('internship'),
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
  t.prismaField({
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    type: InternshipInstance,
    async resolve(query, root, { id }, ctx) {
      const instance = await prisma.internshipInstance.findUnique({
        ...query,
        where: { id },
      });
      return instance == null ||
        ctx.request.auth.ability.cannot(
          'read',
          subject('InternshipInstance', instance),
        )
        ? null
        : instance;
    },
  }),
);

builder.queryField('myInternshipInstances', (t) =>
  t.prismaField({
    type: ['InternshipInstance'],
    resolve(query, root, argumentz, ctx) {
      return prisma.internshipInstance.findMany({
        ...query,
        where: { studentId: ctx.domain.userId },
      });
    },
  }),
);

export const InternshipPosition = builder.prismaObject('InternshipPosition', {
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
    mentor: t.field({
      type: Person,
      resolve(position) {
        return cacheFakeData(
          `internship-position-${position.id}-mentor`,
          generateFakePerson,
        );
      },
    }),
    organisation: t.relation('organisation'),
    summary: t.string({
      resolve(position) {
        const [summary] = position.description.split('\n', 2) as [
          string,
          ...string[],
        ];
        return summary;
      },
    }),
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
  t.prismaField({
    args: {
      id: t.arg.id(),
    },
    nullable: true,
    type: InternshipPosition,
    resolve(query, root, { id }) {
      return prisma.internshipPosition.findUnique({
        ...query,
        where: { id },
      });
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
