import assert from 'node:assert';

import { faker } from '@faker-js/faker';
import type { Organisation, Prisma, PrismaClient } from '@prisma/client';

import { times } from '~/utils';

import { kc } from './helpers';

export async function assertRealmOrganisation(
  prisma: PrismaClient,
): Promise<Organisation> {
  assert(kc.realm.displayName, 'Realm display name is not set');
  const data = { name: kc.realm.displayName };
  const existingOrganisation = await prisma.organisation.findFirst({
    where: data,
  });
  return existingOrganisation ?? prisma.organisation.create({ data });
}

export async function seedOrganisations(prisma: PrismaClient): Promise<void> {
  await assertRealmOrganisation(prisma);
  await prisma.organisation.createMany({
    data: times(
      Math.max(0, 50 - (await prisma.organisation.count())),
      (): Prisma.OrganisationUncheckedCreateInput => ({
        name: faker.company.name(),
      }),
    ),
  });
}
