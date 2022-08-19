import assert from 'node:assert';

import type { Education, EducationTranslation, Language } from '@prisma/client';

import type { AppCradle } from '~/plugins/awilix';
import { prisma } from '~/prisma';

import { handleServiceError } from './helpers';

export interface EducationModel
  extends Education,
    Pick<EducationTranslation, 'title'> {}

type InternalEducation = Education & {
  translations: EducationTranslation[];
};

export class EducationService {
  private language: Language;

  constructor(inject: AppCradle) {
    this.language = inject.language;
  }

  async getAllEducations(): Promise<EducationModel[]> {
    const educations = await prisma.education.findMany({
      include: { translations: true },
    });
    return educations.map(this.mapToModel);
  }

  async getEducationById(id: string): Promise<EducationModel> {
    const education = await prisma.education.findUniqueOrThrow({
      include: { translations: true },
      where: { id },
    });
    return this.mapToModel(education);
  }

  async createEducation(data: { title: string }): Promise<EducationModel> {
    try {
      const education = await prisma.education.create({
        data: {
          translations: {
            create: { languageCode: this.language, ...data },
          },
        },
        include: { translations: true },
      });
      return this.mapToModel(education);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteEducation(id: string): Promise<EducationModel> {
    try {
      const education = await prisma.education.delete({
        include: { translations: true },
        where: { id },
      });
      return this.mapToModel(education);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateEducation(
    id: string,
    data: { title: string },
  ): Promise<EducationModel> {
    const upsert = { languageCode: this.language, ...data };
    try {
      const education = await prisma.education.update({
        data: {
          translations: {
            upsert: {
              create: upsert,
              update: upsert,
              where: {
                educationId_languageCode: {
                  educationId: id,
                  languageCode: this.language,
                },
              },
            },
          },
        },
        include: { translations: true },
        where: { id },
      });
      return this.mapToModel(education);
    } catch (error) {
      handleServiceError(error);
    }
  }

  private mapToModel(education: InternalEducation): EducationModel {
    const { translations, ...baseData } = education;
    const preferedTranslation = translations.find(
      (translation) => translation.languageCode === this.language,
    );
    const translation = preferedTranslation ?? translations[0];
    assert(
      translation,
      `no translation found for education id ${education.id}`,
    );
    return {
      ...baseData,
      title: translation.title,
    };
  }
}
