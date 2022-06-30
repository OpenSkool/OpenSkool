import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';

import { chance, times } from '~/utils';

import { seedCourses } from './course';
import { seedEducations } from './education';
import { generateFakeRange } from './helpers';
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
            organisationId: chance(90)
              ? faker.helpers.arrayElement(organisations).id
              : undefined,
          })),
        },
        courseId: faker.helpers.arrayElement(courses).id,
        dateFrom,
        dateTo,
        descriptionLong: faker.lorem.paragraphs(faker.mersenne.rand(5, 3)),
        descriptionShort: faker.lorem.paragraph(),
        educationId: faker.helpers.arrayElement(educations).id,
        title: faker.company.catchPhrase(),
      },
    });
  }

  const internships = await prisma.internship.findMany({
    include: { availablePositions: true },
  });
  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.internshipInstance.createMany({
      data: times(
        Math.max(
          0,
          5 -
            (await prisma.internshipInstance.count({
              where: { studentId: user.id },
            })),
        ),
        (): Prisma.InternshipInstanceUncheckedCreateInput => ({
          internshipId: faker.helpers.arrayElement(internships).id,
          studentId: user.id,
        }),
      ),
    });
  }
}
