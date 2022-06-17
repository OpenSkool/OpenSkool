import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import { OrganisationModel, UserModel } from '~/domain';
import { getFakeUsers } from '~/schema/types/person';
import { sampleMany, times } from '~/utils';

import builder from '../builder';
import { Node } from './node';

/* eslint-disable @typescript-eslint/no-magic-numbers */

export interface OrganisationModelFake {
  id: string;
  employees: UserModel[];
  name: string;
  plainAddress: string;
  workplaces: WorkplaceModel[];
}

export const Organisation =
  builder.objectRef<OrganisationModel>('Organisation');

export async function createFakeOrganisation(): Promise<OrganisationModelFake> {
  const workplaces = times(2, () => createFakeWorkplace());
  const users = await getFakeUsers();
  return {
    id: cuid(),
    employees: sampleMany(3, users),
    name: faker.company.companyName(),
    plainAddress: (workplaces[0] as WorkplaceModel).plainAddress,
    workplaces,
  };
}

export interface WorkplaceModel {
  id: string;
  plainAddress: string;
}

export const Workplace = builder.objectRef<WorkplaceModel>('Workplace');

export function createFakeWorkplace(): WorkplaceModel {
  return {
    id: cuid(),
    plainAddress: `${faker.address.streetAddress(
      true,
    )}, ${faker.address.city()}`,
  };
}

builder.objectType(Organisation, {
  name: 'Organisation',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
});

builder.objectType(Workplace, {
  name: 'Workplace',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    plainAddress: t.exposeString('plainAddress'),
  }),
});
