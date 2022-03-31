import { Competency, CompetencyTranslation } from '@prisma/client';

import { AppValidationError } from '../errors';
import { prisma } from '../prisma';
import { SchemaValidationErrorCode } from '../schema/constants';
import { DomainContext } from './context';
import { handleServiceError, validateSingleLineString } from './helpers';
import { mapLocaleToLanguageCode } from './helpers/language';

export interface CompetencyModel extends Competency {
  translations: CompetencyTranslation[];
}

export async function createCompetency(
  data: { parentId?: string; title: string },
  context: DomainContext,
): Promise<CompetencyModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  const title = validateSingleLineString(data.title);
  await assertUniqueTitle(title, { parentId: data.parentId }, context);
  let rootId: string | undefined;
  if (data.parentId != null) {
    const parentCompetency = await prisma.competency.findUnique({
      where: { id: data.parentId },
    });
    if (parentCompetency == null) {
      throw new AppValidationError('Foreign key constraint failed', {
        extensions: {
          code: SchemaValidationErrorCode.VALUE_NOT_VALID,
          path: ['parentId'],
        },
      });
    }
    rootId = parentCompetency.rootCompetencyId ?? parentCompetency.id;
  }
  try {
    return await prisma.competency.create({
      data: {
        createdById: context.userId,
        updatedById: context.userId,
        parentCompetencyId: data.parentId,
        rootCompetencyId: rootId,
        translations: { create: { languageCode, title } },
      },
      include: {
        translations: true,
      },
    });
  } catch (error) {
    handleServiceError(error);
  }
}

export async function deleteCompetency(id: string): Promise<CompetencyModel> {
  try {
    return await prisma.competency.delete({
      include: { translations: true },
      where: { id },
    });
  } catch (error) {
    handleServiceError(error);
  }
}

export async function getAllRootCompetencies(
  context: DomainContext,
): Promise<CompetencyModel[]> {
  try {
    return await prisma.competency.findMany({
      include: { translations: true },
      where: { parentCompetencyId: null },
    });
  } catch (error) {
    handleServiceError(error);
  }
}

export async function getNestedCompetenciesByRootId(
  id: string,
  context: DomainContext,
): Promise<CompetencyModel[]> {
  try {
    const nestedCompetencies = await prisma.competency
      .findUnique({ where: { id } })
      .nestedCompetencies({
        include: { translations: true },
      });
    return nestedCompetencies;
  } catch (error) {
    handleServiceError(error);
  }
}

export async function findRandomCompetency(
  context: DomainContext,
): Promise<CompetencyModel | null> {
  const competencyCount = await prisma.competency.count();
  const skip = Math.floor(Math.random() * competencyCount);
  const competencies = await prisma.competency.findMany({
    skip,
    take: 1,

    include: { translations: true },
  });
  return competencies.length === 0 ? null : competencies[0];
}

export async function findRandomRootCompetency(
  context: DomainContext,
): Promise<CompetencyModel | null> {
  const rootCompetencyCount = await prisma.competency.count({
    where: { parentCompetencyId: null },
  });
  const skip = Math.floor(Math.random() * rootCompetencyCount);
  const competencies = await prisma.competency.findMany({
    skip,
    take: 1,

    include: { translations: true },
  });
  return competencies.length === 0 ? null : competencies[0];
}

export async function findCompetencyById(
  id: string,
  context: DomainContext,
): Promise<CompetencyModel | null> {
  // const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competency = await prisma.competency.findUnique({
      include: { translations: true },
      where: { id },
    });
    return competency;
  } catch (error) {
    handleServiceError(error);
  }
}

export async function findSubCompetenciesByParentId(
  id: string,
  context: DomainContext,
): Promise<CompetencyModel[] | null> {
  try {
    const subCompetencies = await prisma.competency
      .findUnique({ where: { id } })
      .subCompetencies({
        include: { translations: true },
      });
    if (subCompetencies.length === 0) {
      return null;
    }
    return subCompetencies.filter(
      (competency) => competency.translations.length > 0,
    );
  } catch (error) {
    handleServiceError(error);
  }
}

export async function updateCompetencyTranslations(
  id: string,
  data: Pick<CompetencyTranslation, 'title'>,
  context: DomainContext,
): Promise<CompetencyModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  const title = validateSingleLineString(data.title);

  try {
    const parent = await prisma.competency
      .findUnique({ where: { id } })
      .parentCompetency({ select: { id: true } });
    await assertUniqueTitle(title, { id, parentId: parent?.id }, context);
    return prisma.competency.update({
      data: {
        updatedById: context.userId,
        translations: {
          updateMany: {
            data: { title },
            where: { languageCode },
          },
        },
      },
      include: {
        translations: {
          where: { languageCode },
        },
      },
      where: { id },
    });
  } catch (error) {
    handleServiceError(error);
  }
}

async function assertUniqueTitle(
  title: string,
  { id, parentId }: { id?: string; parentId?: string },
  context: DomainContext,
): Promise<void> | never {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  let siblingTitles: string[];
  if (parentId == null) {
    const siblings = await prisma.competency.findMany({
      select: {
        translations: {
          select: { title: true },
          where: { languageCode },
        },
      },
      where: {
        id: { not: id },
        parentCompetencyId: null,
        translations: { some: { languageCode } },
      },
    });
    siblingTitles = siblings.map(
      (competency) => competency.translations[0].title,
    );
  } else {
    const siblings = await prisma.competency
      .findUnique({ where: { id: parentId } })
      .subCompetencies({
        select: {
          translations: {
            select: { title: true },
            where: { languageCode },
          },
        },
        where: {
          id: { not: id },
          translations: { some: { languageCode } },
        },
      });
    siblingTitles = siblings.map(
      (competency) => competency.translations[0].title,
    );
  }
  if (siblingTitles.includes(title)) {
    throw new AppValidationError('Title is not unique', {
      extensions: {
        code: SchemaValidationErrorCode.VALUE_NOT_UNIQUE,
        path: ['title'],
      },
    });
  }
}
