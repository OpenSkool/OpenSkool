import { PrismaClient } from '@prisma/client';

import { CompetencyFixture, competencyFixtures } from './fixtures/competencies';

const prisma = new PrismaClient();

async function createCompetency(
  fixture: CompetencyFixture,
  nesting?: { root: string; parent: string },
): Promise<void> {
  const competency = await prisma.competency.create({
    data: {
      parentCompetencyId: nesting?.parent,
      rootCompetencyId: nesting?.root,
      translations: { create: { languageCode: 'EN', title: fixture.title } },
    },
  });
  if (Array.isArray(fixture.children)) {
    await createCompetencies(fixture.children, {
      parent: competency.id,
      root: nesting?.root ?? competency.id,
    });
  }
}

async function createCompetencies(
  fixtures: CompetencyFixture[],
  nesting?: { root: string; parent: string },
): Promise<void> {
  for (const fixture of fixtures) {
    await createCompetency(fixture, nesting);
  }
}

async function main(): Promise<void> {
  await prisma.competency.deleteMany({ where: {} });
  await createCompetencies(competencyFixtures);
  await prisma.education.deleteMany({ where: {} });
  for (const educationTitle of ['Informatics', 'Chemistry', 'Medicine']) {
    await prisma.education.create({
      data: {
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
