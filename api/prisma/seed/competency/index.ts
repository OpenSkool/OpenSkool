import type { CompetencyFramework, PrismaClient } from '@prisma/client';

import { canMedsCompetencies } from './canmeds';
import { basisCompetentiesLeerkracht } from './leerkracht';
import type { CompetencyFixture } from './types';

export async function seedCompetencies(prisma: PrismaClient): Promise<void> {
  await createCompetencyFramework(
    'Basiscompetenties leerkracht',
    basisCompetentiesLeerkracht,
  );
  await createCompetencyFramework('CanMEDS 2015', canMedsCompetencies);

  async function createCompetencyFramework(
    title: string,
    competencies: CompetencyFixture[],
  ): Promise<void> {
    const existingFramework = await prisma.competencyFramework.findFirst({
      where: { translations: { some: { title: { equals: title } } } },
    });
    if (existingFramework == null) {
      const framework = await prisma.competencyFramework.create({
        data: {
          translations: {
            create: { languageCode: 'EN', title },
          },
        },
      });
      await createCompetencies(framework, competencies);
    }
  }

  async function createCompetencies(
    framework: CompetencyFramework,
    fixtures: CompetencyFixture[],
    nesting?: { root: string; parent: string },
  ): Promise<void> {
    for (const fixture of fixtures) {
      await createCompetency(framework, fixture, nesting);
    }
  }

  async function createCompetency(
    framework: CompetencyFramework,
    fixture: CompetencyFixture,
    nesting?: { root: string; parent: string },
  ): Promise<void> {
    const competency = await prisma.competency.create({
      data: {
        frameworkId: framework.id,
        parentCompetencyId: nesting?.parent,
        translations: { create: { languageCode: 'EN', title: fixture.title } },
      },
    });
    if (Array.isArray(fixture.children)) {
      await createCompetencies(framework, fixture.children, {
        parent: competency.id,
        root: nesting?.root ?? competency.id,
      });
    }
  }
}
