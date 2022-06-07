import { faker } from '@faker-js/faker';
import cuid from 'cuid';
import pMemoize from 'p-memoize';

import { UserModel, UserService } from '~/domain';
import { prisma } from '~/prisma';

import builder from '../builder';
import { Node } from './node';

export function createFakePerson(): UserModel {
  return {
    id: cuid(),
    name: faker.name.findName(),
  };
}

export const Person = builder.objectRef<UserModel>('Person');

builder.objectType(Person, {
  name: 'Person',
  interfaces: [Node],
  fields: (t) => ({
    name: t.exposeString('name'),
  }),
});

builder.queryField('allPeople', (t) =>
  t.field({
    type: [Person],
    resolve: () => UserService.getAllUsers(),
  }),
);

export const getFakeUsers = pMemoize(async (): Promise<UserModel[]> => {
  const USERS_COUNT = 50;
  const users = await prisma.user.findMany();
  while (users.length < USERS_COUNT) {
    users.push(createFakePerson());
  }
  return users;
});
