import { faker } from '@faker-js/faker';

import { prisma } from '~/prisma';
import builder from '~/schema/builder';
import { cacheFakeData } from '~/schema/helpers';
import { chance, times } from '~/utils';

import { Course } from '../course';
import { Education } from '../education';
import { Node } from '../node';
import { generateFakeWorkplace, Workplace } from '../organisation';
import { generateFakePerson, Person } from '../person';
import { InternshipApplication } from './refs';

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
      resolve(internship, input, ctx) {
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

export const InternshipInstance = builder.prismaObject('InternshipInstance', {
  description:
    'An instance of an internship contains all information about the internship of 1 student. It is the link between 1 internship and 1 student.',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    applications: t.field({
      type: [InternshipApplication],
      resolve(instance) {
        return prisma.internshipInstance
          .findUniqueOrThrow({ where: { id: instance.id } })
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
      async resolve(instance, input, { inject: { userService } }) {
        return userService.get(instance.studentId);
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

export const InternshipPosition = builder.prismaObject('InternshipPosition', {
  description:
    'An internship position is one specific position within an organisation to execute an internship. When an organisation can host multiple students for a similar positions, there as many internship positions as there are possible hosted students.',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    applications: t.field({
      type: [InternshipApplication],
      resolve(position) {
        return prisma.internshipPosition
          .findUniqueOrThrow({ where: { id: position.id } })
          .applications();
      },
    }),
    description: t.exposeString('description'),
    mentors: t.field({
      type: [Person],
      async resolve(position, input, { inject: { request, userService } }) {
        const mentors = await prisma.internshipPosition
          .findUniqueOrThrow({ where: { id: position.id } })
          .mentors({ select: { userId: true } });
        return userService.getMany(
          mentors.flatMap((mentor) => {
            return mentor.userId == null ? [] : [mentor.userId];
          }),
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
