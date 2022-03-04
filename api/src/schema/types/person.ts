import * as Db from '@prisma/client';
import { extendType, interfaceType, list, nonNull, objectType } from 'nexus';

import { NexusGenFieldTypeNames } from '../../generated/nexus';
import { Node } from './interfaces';

export const Person = interfaceType({
  name: 'Person',
  definition(t) {
    t.implements(Node);
    t.string('firstName');
    t.string('lastName');
  },
  // @ts-expect-error "Nexus types are wrong here. this code works fine."
  // https://nexusjs.org/docs/guides/abstract-types#centralized-strategy-resolvetype
  resolveType(person: Db.Person): keyof NexusGenFieldTypeNames {
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
    t.implements(Person);
  },
});

export const peopleQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('allPeople', {
      type: nonNull(list(nonNull(Person))),
      async resolve(root, argumentz, ctx) {
        return ctx.prisma.person.findMany();
      },
    });
  },
});
