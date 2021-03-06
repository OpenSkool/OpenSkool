import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import { UserModel, UserService } from '~/domain';
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
    name: t.exposeString('name'),
  }),
});

builder.queryField('allPeople', (t) =>
  t.field({
    type: [Person],
    resolve: () => UserService.getAllUsers(),
  }),
);

export function generateFakePerson(): UserModel {
  return {
    id: cuid(),
    name: faker.name.findName(),
  };
}
