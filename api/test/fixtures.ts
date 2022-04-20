import {
  Competency,
  CompetencyFramework,
  Language,
  User,
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
  const user = await createUserFixture();
  return prisma.competencyFramework.create({
    data: {
      createdById: user.id,
      translations: { create: { languageCode: language, title } },
      updatedById: user.id,
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
  const user = await createUserFixture();
  return prisma.competency.create({
    data: {
      createdById: user.id,
      parentCompetencyId: parentId,
      translations: { create: { languageCode: language, title } },
      updatedById: user.id,
    },
  });
}

export async function createUserFixture(): Promise<User> {
  return prisma.user.create({
    data: { id: cuid(), name: 'Joske Vermeulen' },
  });
}
