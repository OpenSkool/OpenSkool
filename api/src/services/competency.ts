import { Competency, CompetencyTranslation, Language } from '@prisma/client';

import { UserError } from '../errors';
import { prisma } from '../prisma';
import { validateSingleLineString } from './validators';

export interface CompetencyModel extends Competency {
  translations: CompetencyTranslation[];
}

interface Accountancy {
  currentUserId: string;
}

export async function createCompetency(
  data: { parentId?: string | null; title: string },
  accountancy: Accountancy,
): Promise<CompetencyModel> {
  const title = validateSingleLineString(data.title);
  let rootId: string | undefined;
  if (data.parentId != null) {
    const parentCompetency = await prisma.competency.findUnique({
      where: { id: data.parentId },
    });
    if (parentCompetency == null) {
      throw new UserError('Foreign key constraint failed');
    }
    rootId = parentCompetency.rootCompetencyId ?? parentCompetency.id;
  }
  const competency = await prisma.competency.create({
    data: {
      createdById: accountancy.currentUserId,
      updatedById: accountancy.currentUserId,
      parentCompetencyId: data.parentId,
      rootCompetencyId: rootId,
      translations: { create: { languageCode: 'EN', title } },
    },
    include: {
      translations: true,
    },
  });
  return competency;
}

export function deleteCompetency(id: string): Promise<CompetencyModel> {
  return prisma.competency.delete({
    include: { translations: true },
    where: { id },
  });
}

export async function getAllRootCompetencies(): Promise<CompetencyModel[]> {
  return prisma.competency.findMany({
    include: {
      translations: { where: { languageCode: Language.EN } },
    },
    where: {
      parentCompetencyId: null,
      translations: { some: { languageCode: Language.EN } },
    },
  });
}

export async function getNestedCompetenciesByRootId(
  id: string,
): Promise<CompetencyModel[]> {
  const nestedCompetencies = await prisma.competency
    .findUnique({ where: { id } })
    .nestedCompetencies({
      include: {
        translations: { where: { languageCode: Language.EN } },
      },
    });
  return nestedCompetencies.filter(
    (competency) => competency.translations.length > 0,
  );
}

export async function findRandomCompetency(): Promise<CompetencyModel | null> {
  const competencyCount = await prisma.competency.count();
  const skip = Math.floor(Math.random() * competencyCount);
  const competencies = await prisma.competency.findMany({
    skip,
    take: 1,

    include: {
      translations: { where: { languageCode: Language.EN } },
    },
    where: {
      translations: { some: { languageCode: Language.EN } },
    },
  });
  return competencies.length === 0 ? null : competencies[0];
}

export async function findRandomRootCompetency(): Promise<CompetencyModel | null> {
  const rootCompetencyCount = await prisma.competency.count({
    where: { parentCompetencyId: null },
  });
  const skip = Math.floor(Math.random() * rootCompetencyCount);
  const competencies = await prisma.competency.findMany({
    skip,
    take: 1,

    include: {
      translations: { where: { languageCode: Language.EN } },
    },
    where: {
      translations: { some: { languageCode: Language.EN } },
    },
  });
  return competencies.length === 0 ? null : competencies[0];
}

export async function findRootCompetencyById(
  id: string,
): Promise<CompetencyModel | null> {
  const competency = await prisma.competency.findUnique({
    include: {
      translations: { where: { languageCode: Language.EN } },
    },
    where: { id },
  });
  if (
    competency == null ||
    competency.parentCompetencyId != null ||
    competency.translations.length === 0
  ) {
    return null;
  }
  return competency;
}

export async function findSubCompetenciesByParentId(
  id: string,
): Promise<CompetencyModel[] | null> {
  const subCompetencies = await prisma.competency
    .findUnique({ where: { id } })
    .subCompetencies({
      include: {
        translations: { where: { languageCode: Language.EN } },
      },
    });
  if (subCompetencies.length === 0) {
    return null;
  }
  return subCompetencies.filter(
    (competency) => competency.translations.length > 0,
  );
}

export async function updateCompetencyTranslations(
  id: string,
  data: Pick<CompetencyTranslation, 'title'>,
  accountancy: Accountancy,
): Promise<CompetencyModel> {
  const title = validateSingleLineString(data.title);
  return prisma.competency.update({
    data: {
      updatedById: accountancy.currentUserId,
      translations: {
        updateMany: {
          data: { title },
          where: { languageCode: Language.EN },
        },
      },
    },
    include: {
      translations: {
        where: { languageCode: Language.EN },
      },
    },
    where: { id },
  });
}
