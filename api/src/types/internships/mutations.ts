import { AppNotFoundError, AppUnauthorizedError } from '~/errors';
import { prisma } from '~/prisma';
import builder from '~/schema/builder';

import { InternshipPosition } from './prisma-types';
import { InternshipApplication } from './refs';

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

builder.mutationField('inviteInternshipPositionMentor', (t) =>
  t.field({
    type: InternshipPosition,
    args: {
      email: t.arg.string(),
      positionId: t.arg.id(),
    },
    async resolve(
      root,
      { email, positionId },
      { inject: { auth, userService } },
    ) {
      if (auth.ability.cannot('update', 'InternshipPosition')) {
        throw new AppUnauthorizedError(
          'You are not allowed to invite internship position mentors',
        );
      }
      const position = await prisma.internshipPosition.findUnique({
        where: { id: positionId },
        select: { id: true },
      });
      if (position == null) {
        throw new AppNotFoundError('Internship position not found.');
      }
      const user = await userService.inviteOrFind(email);
      await prisma.internshipPosition.update({
        data: { mentors: { create: { userId: user.id } } },
        where: { id: positionId },
      });
      return prisma.internshipPosition.findUniqueOrThrow({
        where: { id: positionId },
      });
    },
  }),
);
