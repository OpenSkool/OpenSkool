import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import { UserModel, UserService } from '~/domain';

import builder from '../builder';
import { Node } from './node';

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

export function generateFakePerson(): UserModel {
  return {
    id: cuid(),
    name: faker.name.findName(),
  };
}
