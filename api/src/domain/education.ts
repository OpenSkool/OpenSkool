import { Education, EducationTranslation, Language } from '@prisma/client';

import { prisma } from '../prisma';
import { handleServiceError } from './helpers';

export interface EducationModel extends Education {
  translations: EducationTranslation[];
}

export async function getAllEducations(): Promise<EducationModel[]> {
  return prisma.education.findMany({
    include: {
      translations: { where: { languageCode: Language.EN } },
    },
    where: {
      translations: { some: { languageCode: Language.EN } },
    },
  });
}

export async function createEducation(data: {
  title: string;
}): Promise<EducationModel> {
  try {
    return await prisma.education.create({
      data: {
        translations: {
          create: { languageCode: Language.EN, ...data },
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
): Promise<EducationModel> {
  const upsert = {
    languageCode: Language.EN,
    ...data,
  };
  try {
    return await prisma.education.update({
      data: {
        translations: {
          upsert: {
            create: upsert,
            update: upsert,
            where: {
              educationId_languageCode: {
                educationId: id,
                languageCode: Language.EN,
              },
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
