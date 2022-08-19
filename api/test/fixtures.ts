import {
  type Competency,
  type CompetencyFramework,
  type Education,
  Language,
} from '@prisma/client';
import cuid from 'cuid';

import { prisma } from '../src/prisma';

export async function createCompetencyFrameworkFixture({
  language = Language.EN,
  title = 'Hello World!',
}: {
  language?: Language;
  title?: string;
} = {}): Promise<CompetencyFramework> {
  return prisma.competencyFramework.create({
    data: {
      translations: { create: { languageCode: language, title } },
    },
  });
}

export async function createCompetencyFixture({
  language = Language.EN,
  parentId,
  frameworkId,
  title = 'Hello World!',
}: {
  language?: Language;
  parentId?: string;
  frameworkId?: string;
  title?: string;
} = {}): Promise<Competency> {
  const framework = await prisma.competencyFramework.create({
    data: {
      translations: { create: { languageCode: language, title: 'Framework' } },
    },
  });
  return prisma.competency.create({
    data: {
      frameworkId: frameworkId == null ? framework.id : frameworkId,
      parentCompetencyId: parentId,
      translations: { create: { languageCode: language, title } },
    },
  });
}

export async function createEducationFixture(): Promise<Education> {
  return prisma.education.create({
    data: {
      createdById: cuid(),
      translations: {
        create: { languageCode: Language.EN, title: 'Education Test' },
      },
    },
  });
}
