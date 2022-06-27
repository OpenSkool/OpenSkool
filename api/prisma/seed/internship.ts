import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

import { times } from '~/utils';

import { seedCourses } from './course';
import { seedOrganisations } from './organisation';

export async function seedInternships(prisma: PrismaClient): Promise<void> {
  await seedCourses(prisma);
  await seedOrganisations(prisma);

  const courses = await prisma.course.findMany();
  const organisations = await prisma.organisation.findMany();

  for (let count = await prisma.internship.count(); count <= 50; count += 1) {
    await prisma.internship.create({
      data: {
        availablePositions: {
          create: times(faker.mersenne.rand(20, 10), () => ({
            organisationId: faker.helpers.arrayElement(organisations).id,
            summary: faker.lorem.paragraph(),
          })),
        },
        courseId: faker.helpers.arrayElement(courses).id,
      },
    });
  }

  const internships = await prisma.internship.findMany({
    include: { availablePositions: true },
  });
  const users = await prisma.user.findMany();

  for (const user of users) {
    for (
      let count = await prisma.internshipInstance.count({
        where: { studentId: user.id },
      });
      count <= 5;
      count += 1
    ) {
      await prisma.internshipInstance.create({
        data: {
          internshipId: faker.helpers.arrayElement(internships).id,
          studentId: user.id,
        },
      });
    }
  }
}
