import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import type { UserModel } from '~/domain';
import builder from '~/schema/builder';
import { cacheFakeData } from '~/schema/helpers';

import { Node } from './node';

export const Person = builder.objectRef<UserModel>('Person');

builder.objectType(Person, {
  name: 'Person',
  interfaces: [Node],
  fields: (t) => ({
    avatarUrl: t.string({
      resolve(user) {
        return cacheFakeData(`user-${user.id}-avatar-url`, () => {
          const avatarUrl = new URL(faker.image.avatar());
          avatarUrl.searchParams.set('user', user.id);
          return avatarUrl.toString();
        });
      },
    }),
    name: t.string({
      resolve(user) {
        return user.username ?? 'Anonymous';
      },
    }),
  }),
});

export function generateFakePerson(): UserModel {
  return {
    id: cuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
  };
}
