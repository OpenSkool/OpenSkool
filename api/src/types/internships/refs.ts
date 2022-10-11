import type * as Prisma from '@prisma/client';

import builder from '~/schema/builder';

export const InternshipApplication =
	builder.interfaceRef<Prisma.InternshipApplication>('InternshipApplication');

export const InternshipPriorityApplication =
	builder.objectRef<Prisma.InternshipApplication>(
		'InternshipPriorityApplication',
	);
