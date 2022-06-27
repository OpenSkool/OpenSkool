import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import { OrganisationModel } from '~/domain';
import { cacheFakeData } from '~/schema/helpers';
import { generateFakePerson, Person } from '~/schema/types/person';
import { times } from '~/utils';

import builder from '../builder';
import { Node } from './node';

export const Organisation =
  builder.objectRef<OrganisationModel>('Organisation');

export interface WorkplaceModel {
  id: string;
  plainAddress: string;
}

export const Workplace = builder.objectRef<WorkplaceModel>('Workplace');

builder.objectType(Organisation, {
  name: 'Organisation',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    employees: t.field({
      type: [Person],
      resolve(organisation) {
        /* eslint-disable @typescript-eslint/no-magic-numbers */
        return cacheFakeData(`organisation-${organisation.id}-employees`, () =>
          times(faker.mersenne.rand(3, 1), generateFakePerson),
        );
      },
    }),
    imageUrl: t.string({
      resolve(organisation) {
        return cacheFakeData(
          `organisation-${organisation.id}-image-url`,
          () => {
            const businessImageUrl = new URL(faker.image.business(640, 360));
            businessImageUrl.searchParams.set('organisation', organisation.id);
            return businessImageUrl.toString();
          },
        );
      },
    }),
    name: t.exposeString('name'),
    plainAddress: t.string({
      resolve(organisation) {
        return cacheFakeData(
          `organisation-${organisation.id}-plain-address`,
          generateFakePlainAddress,
        );
      },
    }),
    workplaces: t.field({
      type: [Workplace],
      resolve(organisation) {
        /* eslint-disable @typescript-eslint/no-magic-numbers */
        return cacheFakeData(`organisation-${organisation.id}-workplaces`, () =>
          times(faker.mersenne.rand(3, 1), generateFakeWorkplace),
        );
      },
    }),
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

function generateFakePlainAddress(): string {
  return `${faker.address.streetAddress()}, ${faker.address.zipCode(
    '####',
  )} ${faker.address.cityName()}`;
}

export function generateFakeWorkplace(): WorkplaceModel {
  return {
    id: cuid(),
    plainAddress: generateFakePlainAddress(),
  };
}
