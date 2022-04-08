import {
  Competency,
  CompetencyFramework,
  Language,
  Person,
} from '@prisma/client';

import { prisma } from '../src/prisma';

export async function createCompetencyFrameworkFixture({
  language = Language.EN,
  title = 'Hello World!',
}: {
  language?: Language;
  title?: string;
} = {}): Promise<CompetencyFramework> {
  const person = await createPersonFixture();
  return prisma.competencyFramework.create({
    data: {
      createdById: person.id,
      translations: { create: { languageCode: language, title } },
      updatedById: person.id,
    },
  });
}

export async function createCompetencyFixture({
  language = Language.EN,
  parentId,
  title = 'Hello World!',
}: {
  language?: Language;
  parentId?: string;
  title?: string;
} = {}): Promise<Competency> {
  const person = await createPersonFixture();
  return prisma.competency.create({
    data: {
      createdById: person.id,
      parentCompetencyId: parentId,
      translations: { create: { languageCode: language, title } },
      updatedById: person.id,
    },
  });
}

export async function createPersonFixture(): Promise<Person> {
  return prisma.person.create({
    data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
  });
}
