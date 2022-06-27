import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export async function seedOrganisations(prisma: PrismaClient): Promise<void> {
  for (let count = await prisma.organisation.count(); count <= 50; count += 1) {
    await prisma.organisation.create({
      data: { name: faker.company.companyName() },
    });
  }
}
