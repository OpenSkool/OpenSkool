import assert from 'node:assert';

import {
  Competency,
  CompetencyFramework,
  CompetencyFrameworkTranslation,
  CompetencyTranslation,
  Language,
} from '@prisma/client';

import { AppInputError, AppNotFoundError } from '~/errors';
import { prisma } from '~/prisma';
import { SchemaInputErrorCode } from '~/schema/constants';
import { first } from '~/utils';

import { DomainContext } from './context';
import {
  handleServiceError,
  mapLocaleToLanguageCode,
  validateSingleLineString,
} from './helpers';

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

export async function createNestedCompetency(
  data: { parentId: string; title: string },
  context: DomainContext,
): Promise<CompetencyModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  const parentCompetency = await prisma.competency.findUnique({
    where: { id: data.parentId },
    select: { id: true, competencyFrameworkId: true },
  });

  if (parentCompetency == null) {
    throw new AppNotFoundError('parent competency not found', {
      path: ['parentId'],
    });
  }

  const title = validateSingleLineString(data.title);
  await assertUniqueTitle(title, { parentId: data.parentId }, context);

  try {
    const competency = await prisma.competency.create({
      data: {
        createdById: context.userId,
        updatedById: context.userId,
        competencyFrameworkId: parentCompetency.competencyFrameworkId,
        parentCompetencyId: parentCompetency.id,
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

export async function createRootCompetency(
  data: { frameworkId: string; title: string },
  context: DomainContext,
): Promise<CompetencyModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  const title = validateSingleLineString(data.title);
  await assertUniqueTitle(
    title,
    { parentId: undefined, frameworkId: data.frameworkId },
    context,
  );

  const framework = await prisma.competencyFramework.findUnique({
    where: { id: data.frameworkId },
    select: { id: true },
  });
  if (framework == null) {
    throw new AppNotFoundError('framework not found', {
      path: ['frameworkId'],
    });
  }

  try {
    const competency = await prisma.competency.create({
      data: {
        createdById: context.userId,
        updatedById: context.userId,
        competencyFrameworkId: framework.id,
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

export async function createCompetencyFramework(
  data: { title: string },
  context: DomainContext,
): Promise<CompetencyFrameworkModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  const title = validateSingleLineString(data.title);
  await assertUniqueFrameworkTitle({ title: data.title, context });

  try {
    const competencyFramework = await prisma.competencyFramework.create({
      data: {
        createdById: context.userId,
        updatedById: context.userId,
        translations: { create: { languageCode, title } },
      },
      include: {
        translations: true,
      },
    });
    return mapCompetencyFrameworkToModel(competencyFramework, languageCode);
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
      orderBy: { sort: 'asc' },
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
): Promise<CompetencyFrameworkModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competencyFramework = await prisma.competencyFramework.findUnique({
      include: { translations: true },
      where: { id },
    });
    if (competencyFramework == null) {
      throw new AppNotFoundError();
    }
    return mapCompetencyFrameworkToModel(competencyFramework, languageCode);
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
        orderBy: { sort: 'asc' },
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
): Promise<CompetencyModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const competency = await prisma.competency.findUnique({
      include: { translations: true },
      where: { id },
    });
    if (competency == null) {
      throw new AppNotFoundError();
    }
    return mapCompetencyToModel(competency, languageCode);
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
        orderBy: { sort: 'asc' },
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
          upsert: {
            create: { title, languageCode },
            update: { title },
            where: {
              competencyId_languageCode: { competencyId: id, languageCode },
            },
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

export async function swapCompetencies(
  leftCompetencyId: string,
  rightCompetencyId: string,
  context: DomainContext,
): Promise<[CompetencyModel, CompetencyModel]> {
  const [leftCompetency, rightCompetency] = await prisma.competency.findMany({
    select: {
      id: true,
      parentCompetencyId: true,
      sort: true,
    },
    where: {
      id: { in: [leftCompetencyId, rightCompetencyId] },
    },
    orderBy: {
      sort: 'asc',
    },
  });
  if (leftCompetency == null || rightCompetency == null) {
    throw new AppNotFoundError();
  }
  if (
    leftCompetency.parentCompetencyId !== rightCompetency.parentCompetencyId
  ) {
    throw new AppInputError(
      'invalid-swap-competencies',
      'The competencies must be in the same parent.',
    );
  }
  const languageCode = mapLocaleToLanguageCode(context.locale);
  const [leftResult, rightResult] = await prisma.$transaction([
    prisma.competency.update({
      data: {
        sort: rightCompetency.sort,
        updatedById: context.userId,
      },
      include: { translations: true },
      where: { id: leftCompetencyId },
    }),
    prisma.competency.update({
      data: {
        sort: leftCompetency.sort,
        updatedById: context.userId,
      },
      include: { translations: true },
      where: { id: rightCompetencyId },
    }),
  ]);
  return [
    mapCompetencyToModel(leftResult, languageCode),
    mapCompetencyToModel(rightResult, languageCode),
  ];
}

async function assertUniqueFrameworkTitle({
  title,
  context,
  id,
}: {
  title: string;
  context: DomainContext;
  id?: string;
}): Promise<void> | never {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  let siblingTitles: string[] = [];

  const siblings = await prisma.competencyFramework.findMany({
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

  if (siblingTitles.includes(title)) {
    throw new AppInputError(
      SchemaInputErrorCode.VALUE_NOT_UNIQUE,
      'Title is not unique',
      { path: ['title'] },
    );
  }
}

async function assertUniqueTitle(
  title: string,
  {
    id,
    parentId,
    frameworkId,
  }: {
    id?: string;
    parentId: string | undefined;
    frameworkId?: string;
  },
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
        competencyFrameworkId: frameworkId,
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
    throw new AppInputError(
      SchemaInputErrorCode.VALUE_NOT_UNIQUE,
      'Title is not unique',
      { path: ['title'] },
    );
  }
}
