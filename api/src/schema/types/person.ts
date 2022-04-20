import type { User as UserModel } from '@prisma/client';

import { UserService } from '../../domain';
import builder from '../builder';
import { Node } from './node';

export const Person = builder.interfaceRef<UserModel>('Person');

builder.interfaceType(Person, {
  name: 'Person',
  interfaces: [Node],
  fields: (t) => ({
    name: t.exposeString('name'),
  }),
});

export const Teacher = builder.objectRef<UserModel>('Teacher');

builder.objectType(Teacher, {
  name: 'Teacher',
  interfaces: [Node, Person],
  isTypeOf: () => true,
});

builder.queryField('allPeople', (t) =>
  t.field({
    type: [Person],
    resolve: () => UserService.getAllUsers(),
  }),
);
