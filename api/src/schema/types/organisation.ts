import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import { OrganisationModel } from '~/domain';

import builder from '../builder';
import { Node } from './node';

export const Organisation =
  builder.objectRef<OrganisationModel>('Organisation');

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
    imageUrl: t.string({
      resolve(organisation) {
        return `https://picsum.photos/seed/${organisation.id}/640/360.webp`;
      },
    }),
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
