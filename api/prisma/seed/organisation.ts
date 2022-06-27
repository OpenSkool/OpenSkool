import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';

import { times } from '~/utils';

export async function seedOrganisations(prisma: PrismaClient): Promise<void> {
  await prisma.organisation.createMany({
    data: times(
      Math.max(0, 50 - (await prisma.organisation.count())),
      (): Prisma.OrganisationUncheckedCreateInput => ({
        name: faker.company.companyName(),
      }),
    ),
  });
}
