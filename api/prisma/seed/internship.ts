import { faker } from '@faker-js/faker';
import type { Prisma, PrismaClient } from '@prisma/client';

import { chance, random, times } from '~/utils';

import { seedCourses } from './course';
import { seedEducations } from './education';
import { generateFakeRange, kc } from './helpers';
import { seedOrganisations } from './organisation';

export async function seedInternships(prisma: PrismaClient): Promise<void> {
	await seedCourses(prisma);
	await seedEducations(prisma);
	await seedOrganisations(prisma);

	const courses = await prisma.course.findMany();
	const educations = await prisma.education.findMany();
	const organisations = await prisma.organisation.findMany();

	for (let count = await prisma.internship.count(); count <= 50; count += 1) {
		const [dateFrom, dateTo] = generateFakeRange();

		await prisma.internship.create({
			data: {
				availablePositions: {
					create: times(faker.mersenne.rand(20, 10), () => ({
						description: faker.lorem.paragraphs(),
						mentors: {
							createMany: {
								data: faker.helpers
									.arrayElements(kc.users, faker.mersenne.rand(2, 1))
									.map((user) => ({ userId: user.id })),
							},
						},
						organisationId: chance(90)
							? faker.helpers.arrayElement(organisations).id
							: undefined,
					})),
				},
				courseId: faker.helpers.arrayElement(courses).id,
				dateFrom,
				dateTo,
				descriptionLong: faker.lorem.paragraphs(faker.mersenne.rand(6, 3)),
				descriptionShort: faker.lorem.paragraph(),
				educationId: faker.helpers.arrayElement(educations).id,
				title: faker.company.catchPhrase(),
			},
		});
	}

	const internships = await prisma.internship.findMany({
		include: { availablePositions: true },
	});

	for (const user of kc.users) {
		await prisma.internshipInstance.createMany({
			data: times(
				Math.max(
					0,
					5 -
						(await prisma.internshipInstance.count({
							where: { studentId: user.id },
						})),
				),
				(): Prisma.InternshipInstanceUncheckedCreateInput => {
					const internshipId = faker.helpers.arrayElement(internships).id;
					let assignedPositionId: string | undefined;
					if (random() === 1) {
						assignedPositionId = faker.helpers.arrayElement(
							faker.helpers.arrayElement(internships).availablePositions,
						).id;
					}
					return {
						internshipId,
						studentId: user.id,
						assignedPositionId,
					};
				},
			),
		});
	}
}
