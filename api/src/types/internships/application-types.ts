import { InternshipApplicationVariant } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '~/prisma';
import builder from '~/schema/builder';

import { InternshipInstance, InternshipPosition } from './prisma-types';
import { InternshipApplication, InternshipPriorityApplication } from './refs';

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
