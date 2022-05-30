import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import { times } from '~/utils';

import builder from '../builder';
import { Node } from './node';

/* eslint-disable @typescript-eslint/no-magic-numbers */

export interface OrganisationModel {
  id: string;
  name: string;
  plainAdress: string;
  workplaces: WorkplaceModel[];
}

export function createFakeOrganisation(): OrganisationModel {
  const workplaces = times(2, () => createFakeWorkplace());
  return {
    id: cuid(),
    name: faker.company.companyName(),
    plainAdress: (workplaces[0] as WorkplaceModel).plainAdress,
    workplaces,
  };
}

export const Organisation =
  builder.objectRef<OrganisationModel>('Organisation');

export interface WorkplaceModel {
  id: string;
  plainAdress: string;
}

export function createFakeWorkplace(): WorkplaceModel {
  return {
    id: cuid(),
    plainAdress: `${faker.address.streetAddress(
      true,
    )}, ${faker.address.city()}`,
  };
}

export const Workplace = builder.objectRef<WorkplaceModel>('Workplace');

builder.objectType(Organisation, {
  name: 'Organisation',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    plainAdress: t.exposeString('plainAdress'),
    workplaces: t.expose('workplaces', { type: [Workplace] }),
  }),
});

builder.objectType(Workplace, {
  name: 'Workplace',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    plainAdress: t.exposeString('plainAdress'),
  }),
});
