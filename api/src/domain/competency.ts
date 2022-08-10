import assert from 'node:assert';

import {
  Competency,
  CompetencyFramework,
  CompetencyFrameworkTranslation,
  CompetencyTranslation,
  Language,
} from '@prisma/client';

import type { Auth } from '~/api/auth';
import { AppInputError, AppNotFoundError } from '~/errors';
import type { AppCradle } from '~/plugins/awilix';
import { prisma } from '~/prisma';
import { SchemaInputErrorCode } from '~/schema/constants';
import { first } from '~/utils';

import { handleServiceError, validateSingleLineString } from './helpers';

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

export class CompetencyService {
  auth: Auth;

  language: Language;

  constructor(inject: AppCradle) {
    this.auth = inject.auth;
    this.language = inject.language;
  }

  async createNestedCompetency(data: {
    parentId: string;
    title: string;
  }): Promise<CompetencyModel> {
    assert(this.auth.user);

    const parentCompetency = await prisma.competency.findUnique({
      where: { id: data.parentId },
      select: { id: true, frameworkId: true },
    });

    if (parentCompetency == null) {
      throw new AppNotFoundError('parent competency not found', {
        path: ['parentId'],
      });
    }

    const title = validateSingleLineString(data.title);
    await this.assertUniqueTitle(title, { parentId: data.parentId });

    try {
      const competency = await prisma.competency.create({
        data: {
          createdById: this.auth.user.id,
          updatedById: this.auth.user.id,
          frameworkId: parentCompetency.frameworkId,
          parentCompetencyId: parentCompetency.id,
          translations: { create: { languageCode: this.language, title } },
        },
        include: {
          translations: true,
        },
      });
      return this.mapCompetencyToModel(competency);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createRootCompetency(data: {
    frameworkId: string;
    title: string;
  }): Promise<CompetencyModel> {
    assert(this.auth.user);

    const title = validateSingleLineString(data.title);
    await this.assertUniqueTitle(title, {
      parentId: undefined,
      frameworkId: data.frameworkId,
    });

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
          createdById: this.auth.user.id,
          updatedById: this.auth.user.id,
          frameworkId: framework.id,
          translations: { create: { languageCode: this.language, title } },
        },
        include: {
          translations: true,
        },
      });
      return this.mapCompetencyToModel(competency);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createCompetencyFramework(data: {
    title: string;
  }): Promise<CompetencyFrameworkModel> {
    assert(this.auth.user);

    const title = validateSingleLineString(data.title);
    await this.assertUniqueFrameworkTitle({ title: data.title });

    try {
      const competencyFramework = await prisma.competencyFramework.create({
        data: {
          createdById: this.auth.user.id,
          updatedById: this.auth.user.id,
          translations: { create: { languageCode: this.language, title } },
        },
        include: {
          translations: true,
        },
      });
      return this.mapCompetencyFrameworkToModel(competencyFramework);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteCompetency(id: string): Promise<CompetencyModel> {
    try {
      const competency = await prisma.competency.delete({
        include: { translations: true },
        where: { id },
      });
      return this.mapCompetencyToModel(competency);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getAllRootCompetencies(): Promise<CompetencyModel[]> {
    try {
      const competencies = await prisma.competency.findMany({
        include: { translations: true },
        orderBy: { sort: 'asc' },
        where: { parentCompetencyId: null },
      });
      return competencies.map((competency) =>
        this.mapCompetencyToModel(competency),
      );
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getAllFrameworks(): Promise<CompetencyFrameworkModel[]> {
    try {
      const competencyFrameworks = await prisma.competencyFramework.findMany({
        include: { translations: true },
      });
      return competencyFrameworks.map((competencyFramework) =>
        this.mapCompetencyFrameworkToModel(competencyFramework),
      );
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findFrameworkById(id: string): Promise<CompetencyFrameworkModel> {
    try {
      const competencyFramework = await prisma.competencyFramework.findUnique({
        include: { translations: true },
        where: { id },
      });
      if (competencyFramework == null) {
        throw new AppNotFoundError();
      }
      return this.mapCompetencyFrameworkToModel(competencyFramework);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getFrameworkCompetencies(id: string): Promise<CompetencyModel[]> {
    try {
      const competencies = await prisma.competencyFramework
        .findUnique({ where: { id } })
        .competencies({
          where: { parentCompetencyId: null },
          include: { translations: true },
          orderBy: { sort: 'asc' },
        });
      return competencies.map((competency) =>
        this.mapCompetencyToModel(competency),
      );
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findCompetencyById(id: string): Promise<CompetencyModel> {
    try {
      const competency = await prisma.competency.findUnique({
        include: { translations: true },
        where: { id },
      });
      if (competency == null) {
        throw new AppNotFoundError();
      }
      return this.mapCompetencyToModel(competency);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async findSubCompetenciesByParentId(
    id: string,
  ): Promise<CompetencyModel[] | null> {
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
        this.mapCompetencyToModel(competency),
      );
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateCompetencyTranslations(
    id: string,
    data: Pick<CompetencyTranslation, 'title'>,
  ): Promise<CompetencyModel> {
    assert(this.auth.user);

    const title = validateSingleLineString(data.title);

    try {
      const parent = await prisma.competency
        .findUnique({ where: { id } })
        .parentCompetency({ select: { id: true } });
      await this.assertUniqueTitle(title, { id, parentId: parent?.id });
      const competency = await prisma.competency.update({
        data: {
          updatedById: this.auth.user.id,
          translations: {
            upsert: {
              create: { title, languageCode: this.language },
              update: { title },
              where: {
                competencyId_languageCode: {
                  competencyId: id,
                  languageCode: this.language,
                },
              },
            },
          },
        },
        include: { translations: true },
        where: { id },
      });
      return this.mapCompetencyToModel(competency);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async swapCompetencies(
    leftCompetencyId: string,
    rightCompetencyId: string,
  ): Promise<[CompetencyModel, CompetencyModel]> {
    assert(this.auth.user);

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
    const [leftResult, rightResult] = await prisma.$transaction([
      prisma.competency.update({
        data: {
          sort: rightCompetency.sort,
          updatedById: this.auth.user.id,
        },
        include: { translations: true },
        where: { id: leftCompetencyId },
      }),
      prisma.competency.update({
        data: {
          sort: leftCompetency.sort,
          updatedById: this.auth.user.id,
        },
        include: { translations: true },
        where: { id: rightCompetencyId },
      }),
    ]);
    return [
      this.mapCompetencyToModel(leftResult),
      this.mapCompetencyToModel(rightResult),
    ];
  }

  private async assertUniqueFrameworkTitle({
    title,
    id,
  }: {
    title: string;
    id?: string;
  }): Promise<void> | never {
    let siblingTitles: string[] = [];

    const siblings = await prisma.competencyFramework.findMany({
      select: {
        translations: {
          select: { title: true },
          where: { languageCode: this.language },
        },
      },
      where: {
        id: { not: id },
        translations: { some: { languageCode: this.language } },
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

  private async assertUniqueTitle(
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
  ): Promise<void> | never {
    let siblingTitles: string[] = [];

    if (parentId == null) {
      const siblings = await prisma.competency.findMany({
        select: {
          translations: {
            select: { title: true },
            where: { languageCode: this.language },
          },
        },
        where: {
          id: { not: id },
          parentCompetencyId: null,
          frameworkId,
          translations: { some: { languageCode: this.language } },
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
              where: { languageCode: this.language },
            },
          },
          where: {
            id: { not: id },
            translations: { some: { languageCode: this.language } },
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

  private mapCompetencyFrameworkToModel(
    competency: InternalCompetencyFramework,
  ): CompetencyFrameworkModel {
    const { translations, ...baseData } = competency;
    const preferedTranslation = translations.find(
      (translation) => translation.languageCode === this.language,
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

  private mapCompetencyToModel(
    competency: InternalCompetency,
  ): CompetencyModel {
    const { translations, ...baseData } = competency;
    const preferedTranslation = translations.find(
      (translation) => translation.languageCode === this.language,
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
}
