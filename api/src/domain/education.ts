import assert from 'node:assert';

import { Education, EducationTranslation, Language } from '@prisma/client';

import { prisma } from '~/prisma';

import { DomainContext } from './context';
import { handleServiceError } from './helpers';
import { mapLocaleToLanguageCode } from './helpers/language';

export interface EducationModel
  extends Education,
    Pick<EducationTranslation, 'title'> {}

type InternalEducation = Education & {
  translations: EducationTranslation[];
};

function mapToModel(
  education: InternalEducation,
  languageCode: Language,
): EducationModel {
  const { translations, ...baseData } = education;
  const preferedTranslation = translations.find(
    (translation) => translation.languageCode === languageCode,
  );
  const translation = preferedTranslation ?? translations[0];
  assert(translation, `no translation found for education id ${education.id}`);
  return {
    ...baseData,
    title: translation.title,
  };
}

export async function getAllEducations(
  context: DomainContext,
): Promise<EducationModel[]> {
  const preferedLanguageCode = mapLocaleToLanguageCode(context.locale);

  const educations = await prisma.education.findMany({
    include: { translations: true },
  });

  return educations.map((education) =>
    mapToModel(education, preferedLanguageCode),
  );
}

export async function createEducation(
  data: { title: string },
  context: DomainContext,
): Promise<EducationModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const education = await prisma.education.create({
      data: { translations: { create: { languageCode, ...data } } },
      include: { translations: true },
    });
    return mapToModel(education, languageCode);
  } catch (error) {
    handleServiceError(error);
  }
}

export async function deleteEducation(
  id: string,
  context: DomainContext,
): Promise<EducationModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    const education = await prisma.education.delete({
      include: { translations: true },
      where: { id },
    });
    return mapToModel(education, languageCode);
  } catch (error) {
    handleServiceError(error);
  }
}

export async function updateEducation(
  id: string,
  data: { title: string },
  context: DomainContext,
): Promise<EducationModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  const upsert = { languageCode, ...data };
  try {
    const education = await prisma.education.update({
      data: {
        translations: {
          upsert: {
            create: upsert,
            update: upsert,
            where: {
              educationId_languageCode: { educationId: id, languageCode },
            },
          },
        },
      },
      include: { translations: true },
      where: { id },
    });
    return mapToModel(education, languageCode);
  } catch (error) {
    handleServiceError(error);
  }
}
