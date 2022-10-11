import { subject } from '@casl/ability';
import { accessibleBy } from '@casl/prisma';

import { prisma } from '~/prisma';
import builder from '~/schema/builder';

import { InternshipInstance, InternshipPosition } from './prisma-types';

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

builder.queryField('myInternshipInstances', (t) =>
	t.prismaField({
		type: ['InternshipInstance'],
		resolve(query, root, input, { inject: { auth } }) {
			return prisma.internshipInstance.findMany({
				...query,
				where: accessibleBy(auth.ability).InternshipInstance,
			});
		},
	}),
);
