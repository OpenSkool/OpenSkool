import { CompetencyFramework, User, PrismaClient } from '@prisma/client';

import { CompetencyFixture, competencyFixtures } from './fixtures/competencies';

const prisma = new PrismaClient();

async function createCompetency(
  framework: CompetencyFramework,
  fixture: CompetencyFixture,
  user: User,
  nesting?: { root: string; parent: string },
): Promise<void> {
  const competency = await prisma.competency.create({
    data: {
      createdById: user.id,
      frameworkId: framework.id,
      updatedById: user.id,
      parentCompetencyId: nesting?.parent,
      translations: { create: { languageCode: 'EN', title: fixture.title } },
    },
  });
  if (Array.isArray(fixture.children)) {
    await createCompetencies(framework, fixture.children, user, {
      parent: competency.id,
      root: nesting?.root ?? competency.id,
    });
  }
}

async function createCompetencies(
  framework: CompetencyFramework,
  fixtures: CompetencyFixture[],
  user: User,
  nesting?: { root: string; parent: string },
): Promise<void> {
  for (const fixture of fixtures) {
    await createCompetency(framework, fixture, user, nesting);
  }
}

async function createInternships(user: User): Promise<void> {
  const COURSE_NAMES = [
    'Chemistry',
    'Economics',
    'Electricity',
    'Fashion',
    'Informatics',
    'Math',
    'Mechanics',
    'Photography',
  ];

  await prisma.course.deleteMany({ where: {} });
  await prisma.internship.deleteMany({ where: {} });
  await prisma.internshipInstance.deleteMany({ where: {} });

  for (const name of COURSE_NAMES) {
    const course = await prisma.course.create({
      data: {
        name,
      },
    });

    const internship = await prisma.internship.create({
      data: {
        courseId: course.id,
      },
    });

    await prisma.internshipInstance.create({
      data: {
        internshipId: internship.id,
        studentId: user.id,
      },
    });
  }
}

async function main(): Promise<void> {
  const { SEED_USER_ID, SEED_USER_NAME } = process.env;
  if (SEED_USER_ID == null || SEED_USER_NAME == null) {
    throw new Error('Configure your seed user. See README');
  }
  await prisma.user.deleteMany({
    where: { id: SEED_USER_ID },
  });
  const user = await prisma.user.create({
    data: { id: SEED_USER_ID, name: SEED_USER_NAME },
  });

  await prisma.competencyFramework.deleteMany({ where: {} });
  const competencyFramework = await prisma.competencyFramework.create({
    data: {
      createdById: user.id,
      updatedById: user.id,
      translations: { create: { languageCode: 'EN', title: 'CanMEDS 2015' } },
    },
  });

  await prisma.competency.deleteMany({ where: {} });
  await createCompetencies(competencyFramework, competencyFixtures, user);

  await prisma.education.deleteMany({ where: {} });
  for (const educationTitle of ['Informatics', 'Chemistry', 'Medicine']) {
    await prisma.education.create({
      data: {
        createdById: user.id,
        updatedById: user.id,
        translations: { create: { languageCode: 'EN', title: educationTitle } },
      },
    });
  }
  await createInternships(user);
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  prisma.$disconnect();
}
