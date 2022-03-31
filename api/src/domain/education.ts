import { Education, EducationTranslation } from '@prisma/client';

import { prisma } from '../prisma';
import { DomainContext } from './context';
import { handleServiceError } from './helpers';
import { mapLocaleToLanguageCode } from './helpers/language';

export interface EducationModel extends Education {
  translations: EducationTranslation[];
}

export async function getAllEducations(
  context: DomainContext,
): Promise<EducationModel[]> {
  const languageCode = mapLocaleToLanguageCode(context.locale);
  return prisma.education.findMany({
    include: {
      translations: { where: { languageCode } },
    },
    where: {
      translations: { some: { languageCode } },
    },
  });
}

export async function createEducation(
  data: { title: string },
  context: DomainContext,
): Promise<EducationModel> {
  const languageCode = mapLocaleToLanguageCode(context.locale);

  try {
    return await prisma.education.create({
      data: {
        translations: {
          create: { languageCode, ...data },
        },
      },
      include: { translations: true },
    });
  } catch (error) {
    handleServiceError(error);
  }
}

export async function deleteEducation(id: string): Promise<EducationModel> {
  try {
    return await prisma.education.delete({
      include: { translations: true },
      where: { id },
    });
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
    return await prisma.education.update({
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
  } catch (error) {
    handleServiceError(error);
  }
}
