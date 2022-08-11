import { subject } from '@casl/ability';
import { accessibleBy } from '@casl/prisma';
import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import { InternshipApplicationVariant } from '@prisma/client';
import { z } from 'zod';

import { AppNotFoundError, AppUnauthorizedError } from '~/errors';
import { prisma } from '~/prisma';
import builder from '~/schema/builder';
import { cacheFakeData } from '~/schema/helpers';
import { Course } from '~/types/course';
import { Education } from '~/types/education';
import { generateFakePerson, Person } from '~/types/person';
import { chance, times } from '~/utils';

import { Node } from './node';
import { generateFakeWorkplace, Workplace } from './organisation';

export const Internship = builder.prismaObject('Internship', {
  description:
    'An internship is part of some courses where the students executes activities within another organisation.',
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
    dateFrom: t.expose('dateFrom', { type: 'DateTime' }),
    dateTo: t.expose('dateTo', { type: 'DateTime' }),
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
      resolve(internship, _arguments, ctx) {
        const educationService =
          ctx.request.diScope.resolve('educationService');
        return educationService.getEducationById(internship.educationId);
      },
    }),
    title: t.exposeString('title'),
    urls: t.stringList({
      /* eslint-disable @typescript-eslint/no-magic-numbers */
      resolve: () => times(faker.mersenne.rand(2), () => faker.internet.url()),
    }),
  }),
});

const InternshipApplication =
  builder.interfaceRef<Prisma.InternshipApplication>('InternshipApplication');

const InternshipPriorityApplication =
  builder.objectRef<Prisma.InternshipApplication>(
    'InternshipPriorityApplication',
  );

const InternshipInstance = builder.prismaObject('InternshipInstance', {
  description:
    'An instance of an internship contains all information about the internship of 1 student. It is the link between 1 internship and 1 student.',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    applications: t.field({
      type: [InternshipApplication],
      resolve(instance) {
        return prisma.internshipInstance
          .findUnique({ where: { id: instance.id } })
          .applications();
      },
    }),
    appliedForPosition: t.boolean({
      args: {
        id: t.arg.id(),
      },
      async resolve(instance, { id }) {
        const application = await prisma.internshipApplication.findUnique({
          where: {
            instanceId_positionId: { instanceId: instance.id, positionId: id },
          },
        });
        return application != null;
      },
    }),
    assignedPosition: t.relation('assignedPosition', { nullable: true }),
    internship: t.relation('internship'),
    isPositionAssigned: t.boolean({
      resolve(instance) {
        return instance.assignedPositionId != null;
      },
    }),
    student: t.field({
      type: Person,
      async resolve(instance, _arguments, { inject: { userService } }) {
        return userService.findUserById(instance.studentId);
      },
    }),
    supervisors: t.field({
      type: [Person],
      async resolve(instance) {
        return cacheFakeData(
          `internship-instance-${instance.id}-supervisors`,
          () => times(faker.mersenne.rand(4, 1), generateFakePerson),
        );
      },
    }),
    urls: t.stringList({
      resolve: () => times(faker.mersenne.rand(2), () => faker.internet.url()),
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
    async resolve(query, root, { id }, { inject: { auth } }) {
      const instance = await prisma.internshipInstance.findUnique({
        ...query,
        where: { id },
      });
      return instance == null ||
        auth.ability.can('read', subject('InternshipInstance', instance))
        ? instance
        : null;
    },
  }),
);

builder.queryField('myInternshipInstances', (t) =>
  t.prismaField({
    type: ['InternshipInstance'],
    resolve(query, root, _arguments, { inject: { auth } }) {
      return prisma.internshipInstance.findMany({
        ...query,
        where: accessibleBy(auth.ability).InternshipInstance,
      });
    },
  }),
);

export const InternshipPosition = builder.prismaObject('InternshipPosition', {
  description:
    'An internship position is one specific position within an organisation to execute an internship. When an organisation can host multiple students for a similar positions, there as many internship positions as there are possible hosted students.',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
    mentors: t.field({
      type: [Person],
      resolve(position) {
        return cacheFakeData(
          `internship-position-${position.id}-mentors`,
          () => {
            return chance(5)
              ? []
              : times(faker.mersenne.rand(3, 1), generateFakePerson);
          },
        );
      },
    }),
    organisation: t.relation('organisation', {
      nullable: true,
    }),
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
      nullable: true,
      resolve(position) {
        return cacheFakeData(
          `internship-position-organisation-${position.organisationId}-workplace`,
          () => (chance() ? generateFakeWorkplace() : undefined),
        );
      },
    }),
    urls: t.stringList({
      resolve: () => times(faker.mersenne.rand(2), () => faker.internet.url()),
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

builder.interfaceType(InternshipApplication, {
  fields: (t) => ({
    instance: t.field({
      type: InternshipInstance,
      async resolve(application, arguments_, ctx) {
        return prisma.internshipInstance.findUniqueOrThrow({
          where: { id: application.instanceId },
        });
      },
    }),
    position: t.field({
      type: InternshipPosition,
      resolve(application, arguments_, ctx) {
        return prisma.internshipPosition.findUniqueOrThrow({
          where: { id: application.positionId },
        });
      },
    }),
  }),
});

const priorityValidator = z.number().int().positive();

builder.objectType(InternshipPriorityApplication, {
  interfaces: [InternshipApplication],
  fields: (t) => ({
    priority: t.int({
      resolve: (application) => {
        return priorityValidator.parse(application.variantValue);
      },
    }),
  }),
  isTypeOf(source) {
    try {
      z.object({
        variantType: z.literal(InternshipApplicationVariant.Priority),
      }).parse(source);
      return true;
    } catch {
      return false;
    }
  },
});

builder.mutationField('applyForPriorityInternshipPosition', (t) =>
  t.field({
    type: InternshipApplication,
    args: {
      instanceId: t.arg.id(),
      positionId: t.arg.id(),
      priority: t.arg.int(),
    },
    async resolve(
      root,
      { priority, instanceId, positionId },
      { inject: { auth } },
    ) {
      if (auth.ability.cannot('create', 'InternshipApplication')) {
        throw new AppUnauthorizedError(
          'You are not allowed to create an internship application',
        );
      }
      const instance = await prisma.internshipInstance.findUnique({
        select: { studentId: true },
        where: { id: instanceId },
      });
      if (instance == null || instance.studentId !== auth.user?.id) {
        throw new AppNotFoundError('Internship instance not found.');
      }
      return prisma.internshipApplication.create({
        data: {
          variantType: 'Priority',
          variantValue: priority,
          instanceId,
          positionId,
        },
      });
    },
  }),
);
