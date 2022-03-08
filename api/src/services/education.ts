import { Language } from '@prisma/client';

import { prisma } from '../prisma';
import { Education } from '../schema/source-types';

export async function getAllEducations(): Promise<Education[]> {
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
}): Promise<Education> {
  return prisma.education.create({
    data: {
      translations: {
        create: { languageCode: Language.EN, ...data },
      },
    },
    include: { translations: true },
  });
}

export async function deleteEducation(id: string): Promise<Education> {
  return prisma.education.delete({
    include: { translations: true },
    where: { id },
  });
}

export async function updateEducation(
  id: string,
  data: { title: string },
): Promise<Education> {
  const upsert = {
    languageCode: Language.EN,
    ...data,
  };
  const education = await prisma.education.update({
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
  return education;
}
