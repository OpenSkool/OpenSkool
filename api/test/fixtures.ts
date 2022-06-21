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
  frameworkId,
  title = 'Hello World!',
}: {
  language?: Language;
  parentId?: string;
  frameworkId?: string;
  title?: string;
} = {}): Promise<Competency> {
  const user = await createUserFixture();
  const framework = await prisma.competencyFramework.create({
    data: {
      createdById: user.id,
      translations: { create: { languageCode: language, title: 'Framework' } },
    },
  });
  return prisma.competency.create({
    data: {
      createdById: user.id,
      frameworkId: frameworkId == null ? framework.id : frameworkId,
      parentCompetencyId: parentId,
      translations: { create: { languageCode: language, title } },
      updatedById: user.id,
    },
  });
}

export async function createUserFixture(data?: Partial<User>): Promise<User> {
  return prisma.user.create({
    data: { id: cuid(), name: 'Joske Vermeulen', ...data },
  });
}
