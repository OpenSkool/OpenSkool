import { extendType, interfaceType, list, nonNull, objectType } from 'nexus';

import { PersonService } from '../../domain';

export const Person = interfaceType({
  name: 'Person',
  definition(t) {
    t.implements('Node');
    t.nonNull.string('displayName', {
      resolve(parent, argumentz, ctx) {
        return `${parent.firstName} ${parent.lastName}`;
      },
    });
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
  },
  resolveType(person) {
    switch (person.role) {
      default:
        throw new Error(
          `Could not resolve the type of data passed to interface type "Person"`,
        );
      case 'TEACHER':
        return 'Teacher';
    }
  },
});

export const Teacher = objectType({
  name: 'Teacher',
  definition(t) {
    t.implements('Person');
  },
  sourceType: { export: 'Person', module: '@prisma/client' },
});

export const PeopleQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('allPeople', {
      type: list(nonNull(Person)),
      async resolve(root, argumentz, ctx) {
        return PersonService.getAllPeople();
      },
    });
  },
});
