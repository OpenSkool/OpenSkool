import type { Person as PersonModel } from '@prisma/client';

import { PersonService } from '../../domain';
import builder from '../builder';
import { Node } from './node';

export const Person = builder.interfaceRef<PersonModel>('Person');

builder.interfaceType(Person, {
  name: 'Person',
  interfaces: [Node],
  fields: (t) => ({
    displayName: t.string({
      resolve(parent) {
        return `${parent.firstName} ${parent.lastName}`;
      },
    }),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
  }),
});

export const Teacher = builder.objectRef<PersonModel>('Teacher');

builder.objectType(Teacher, {
  name: 'Teacher',
  interfaces: [Node, Person],
  isTypeOf: () => true,
});

builder.queryField('allPeople', (t) =>
  t.field({
    type: [Person],
    resolve: () => PersonService.getAllPeople(),
  }),
);
