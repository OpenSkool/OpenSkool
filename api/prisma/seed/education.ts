import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const EDUCATION_TITLES = ['Informatics', 'Chemistry', 'Medicine'];

export async function seedEducations(prisma: PrismaClient): Promise<void> {
  const user = faker.helpers.arrayElement(await prisma.user.findMany());

  for (const title of EDUCATION_TITLES) {
    const existingEducation = await prisma.education.findFirst({
      where: { translations: { some: { title: { equals: title } } } },
    });
    if (existingEducation == null) {
      await prisma.education.create({
        data: {
          createdById: user.id,
          updatedById: user.id,
          translations: { create: { languageCode: 'EN', title } },
        },
      });
    }
  }
}
