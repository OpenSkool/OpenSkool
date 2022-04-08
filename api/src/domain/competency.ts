import assert from 'assert';

import {
  Competency,
  CompetencyFramework,
  CompetencyFrameworkTranslation,
  CompetencyTranslation,
  Language,
} from '@prisma/client';

import { AppValidationError } from '../errors';
import { prisma } from '../prisma';
import { SchemaValidationErrorCode } from '../schema/constants';
import { first } from '../utils';
import { DomainContext } from './context';
import { handleServiceError, validateSingleLineString } from './helpers';
import { mapLocaleToLanguageCode } from './helpers/language';

export interface CompetencyModel
  extends Competency,
    Pick<CompetencyTranslation, 'title'> {}

export interface CompetencyFrameworkModel
  extends CompetencyFramework,
    Pick<CompetencyTranslation, 'title'> {}

type InternalCompetency = Competency & {
  translations: CompetencyTranslation[];
};

type InternalCompetencyFramework = CompetencyFramework & {
  translations: CompetencyFrameworkTranslation[];
};

function mapCompetencyToModel(
  competency: InternalCompetency,
  languageCode: Language,
): CompetencyModel {
  const { translations, ...baseData } = competency;
  const preferedTranslation = translations.find(
    (translation) => translation.languageCode === languageCode,
  );
  const translation = preferedTranslation ?? translations[0];
  assert(
    translation,
    `no translation found for competency id ${competency.id}`,
  );
  return {
    ...baseData,
    title: translation.title,
  };
}

function mapCompetencyFrameworkToModel(
  competency: InternalCompetencyFramework,
  languageCode: Language,
): CompetencyFrameworkModel {
  const { translations, ...baseData } = competency;
  const preferedTranslation = translations.find(
    (translation) => translation.languageCode === languageCode,
  );
  const translation = preferedTranslation ?? translations[0];
  assert(
    translation,
    `no translation found for competency id ${competency.id}`,
  );
  return {
    ...baseData,
    title: translation.title,
  };
}

export async function createCompetency(
  data: { parentId?: string; title: string },
  context: DomainContext,
): Promise<CompetencyModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  const title = validateSingleLineString(data.title);
  await assertUniqueTitle(title, { parentId: data.parentId }, context);
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
  }
  try {
    const competency = await prisma.competency.create({
      data: {
        createdById: context.userId,
        updatedById: context.userId,
        parentCompetencyId: data.parentId,
        translations: { create: { languageCode, title } },
      },
      include: {
        translations: true,
      },
    });
    return mapCompetencyToModel(competency, languageCode);
  } catch (error) {
    handleServiceError(error);
  }
}

export async function deleteCompetency(
  id: string,
  context: DomainContext,
): Promise<CompetencyModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competency = await prisma.competency.delete({
      include: { translations: true },
      where: { id },
    });
    return mapCompetencyToModel(competency, languageCode);
  } catch (error) {
    handleServiceError(error);
  }
}

export async function getAllRootCompetencies(
  context: DomainContext,
): Promise<CompetencyModel[]> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competencies = await prisma.competency.findMany({
      include: { translations: true },
      where: { parentCompetencyId: null },
    });
    return competencies.map((competency) =>
      mapCompetencyToModel(competency, languageCode),
    );
  } catch (error) {
    handleServiceError(error);
  }
}

export async function getAllFrameworks(
  context: DomainContext,
): Promise<CompetencyFrameworkModel[]> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competencyFrameworks = await prisma.competencyFramework.findMany({
      include: { translations: true },
    });
    return competencyFrameworks.map((competencyFramework) =>
      mapCompetencyFrameworkToModel(competencyFramework, languageCode),
    );
  } catch (error) {
    handleServiceError(error);
  }
}

export async function findFrameworkById(
  id: string,
  context: DomainContext,
): Promise<CompetencyFrameworkModel | null> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competency = await prisma.competency.findUnique({
      include: { translations: true },
      where: { id },
    });
    return competency == null
      ? null
      : mapCompetencyToModel(competency, languageCode);
  } catch (error) {
    handleServiceError(error);
  }
}

export async function getFrameworkCompetencies(
  id: string,
  context: DomainContext,
): Promise<CompetencyModel[]> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competencies = await prisma.competencyFramework
      .findUnique({ where: { id } })
      .competencies({
        where: { parentCompetencyId: null },
        include: { translations: true },
      });
    return competencies.map((competency) =>
      mapCompetencyToModel(competency, languageCode),
    );
  } catch (error) {
    handleServiceError(error);
  }
}

export async function findCompetencyById(
  id: string,
  context: DomainContext,
): Promise<CompetencyModel | null> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competency = await prisma.competency.findUnique({
      include: { translations: true },
      where: { id },
    });
    return competency == null
      ? null
      : mapCompetencyToModel(competency, languageCode);
  } catch (error) {
    handleServiceError(error);
  }
}

export async function findSubCompetenciesByParentId(
  id: string,
  context: DomainContext,
): Promise<CompetencyModel[] | null> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const subCompetencies = await prisma.competency
      .findUnique({ where: { id } })
      .subCompetencies({
        include: { translations: true },
      });
    if (subCompetencies.length === 0) {
      return null;
    }
    return subCompetencies.map((competency) =>
      mapCompetencyToModel(competency, languageCode),
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
  const title = validateSingleLineString(data.title);

  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const parent = await prisma.competency
      .findUnique({ where: { id } })
      .parentCompetency({ select: { id: true } });
    await assertUniqueTitle(title, { id, parentId: parent?.id }, context);
    const competency = await prisma.competency.update({
      data: {
        updatedById: context.userId,
        translations: {
          updateMany: {
            data: { title },
            where: { languageCode },
          },
        },
      },
      include: { translations: true },
      where: { id },
    });
    return mapCompetencyToModel(competency, languageCode);
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

  let siblingTitles: string[] = [];

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
    siblingTitles = siblings.reduce<string[]>((titles, competency) => {
      const translation = first(competency.translations);
      if (translation != null) {
        titles.push(translation.title);
      }
      return titles;
    }, []);
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
    siblingTitles = siblings.reduce<string[]>((titles, competency) => {
      const translation = first(competency.translations);
      if (translation != null) {
        titles.push(translation.title);
      }
      return titles;
    }, []);
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
