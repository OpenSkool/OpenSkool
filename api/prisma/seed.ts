import { PrismaClient } from '@prisma/client';

import { CompetencyFixture, competencyFixtures } from './fixtures/competencies';

const prisma = new PrismaClient();

const sample = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)] as T;

async function createCompetency(
  fixture: CompetencyFixture,
  peopleIds: string[],
  nesting?: { root: string; parent: string },
): Promise<void> {
  const competency = await prisma.competency.create({
    data: {
      createdById: sample(peopleIds),
      updatedById: sample(peopleIds),
      parentCompetencyId: nesting?.parent,
      translations: { create: { languageCode: 'EN', title: fixture.title } },
    },
  });
  if (Array.isArray(fixture.children)) {
    await createCompetencies(fixture.children, peopleIds, {
      parent: competency.id,
      root: nesting?.root ?? competency.id,
    });
  }
}

async function createCompetencies(
  fixtures: CompetencyFixture[],
  peopleIds: string[],
  nesting?: { root: string; parent: string },
): Promise<void> {
  for (const fixture of fixtures) {
    await createCompetency(fixture, peopleIds, nesting);
  }
}

async function main(): Promise<void> {
  await prisma.person.deleteMany({});
  await prisma.person.createMany({
    data: [
      { firstName: 'Sam', lastName: 'Bossant', role: 'TEACHER' },
      { firstName: 'Peter', lastName: 'Buytaert', role: 'TEACHER' },
      { firstName: 'Yannick', lastName: 'Gils', role: 'TEACHER' },
      { firstName: 'Dieter', lastName: 'Luypaert ', role: 'TEACHER' },
      { firstName: 'Stijn', lastName: 'Van Vlierberghe', role: 'TEACHER' },
      { firstName: 'Alexander', lastName: 'Vandoren', role: 'TEACHER' },
    ],
  });
  const peopleWithIds = await prisma.person.findMany({ select: { id: true } });
  const peopleIds = peopleWithIds.map(({ id }) => id);

  await prisma.competency.deleteMany({ where: {} });
  await createCompetencies(competencyFixtures, peopleIds);

  await prisma.education.deleteMany({ where: {} });
  for (const educationTitle of ['Informatics', 'Chemistry', 'Medicine']) {
    await prisma.education.create({
      data: {
        createdById: sample(peopleIds),
        updatedById: sample(peopleIds),
        translations: { create: { languageCode: 'EN', title: educationTitle } },
      },
    });
  }
}

(async (): Promise<void> => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
})();
