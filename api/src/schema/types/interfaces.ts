import * as Db from '@prisma/client';
import { interfaceType } from 'nexus';

import { PersonService } from '../../services/module';

const DELETED_USER: Db.Person = {
  id: '__DELETED_USER__',
  firstName: 'Deleted',
  lastName: 'User',
  role: 'EXTERNAL',
};

export const Accountable = interfaceType({
  name: 'Accountable',
  description:
    'An accountable resource tracks when and by whom it was created and last updated.',
  definition(t) {
    t.nonNull.dateTime('createdAt');
    t.nonNull.field('createdBy', {
      type: 'Person',
      async resolve(parent, argumentz, ctx) {
        if (parent.createdById == null) {
          return DELETED_USER;
        }
        const person = await PersonService.findPersonById(parent.createdById);
        return person ?? DELETED_USER;
      },
    });
    t.nonNull.dateTime('updatedAt');
    t.nonNull.field('updatedBy', {
      type: 'Person',
      async resolve(parent, argumentz, ctx) {
        if (parent.updatedById == null) {
          return DELETED_USER;
        }
        const person = await PersonService.findPersonById(parent.updatedById);
        return person ?? DELETED_USER;
      },
    });
  },
  resolveType(data) {
    // Not necessary to implement as long as we don't return this interface
    // type in a resolver.
    throw new Error('Cannot discriminate accountable type');
  },
});

export interface NodeModel {
  id: string;
}

export const Node = interfaceType({
  name: 'Node',
  description: 'A node is any resource that can be identified via an ID.',
  definition(t) {
    t.nonNull.id('id', { description: 'A CUID for a resource' });
  },
  resolveType(data) {
    // Not necessary to implement as long as we don't return this interface
    // type in a resolver.
    throw new Error('Cannot discriminate node type');
  },
  sourceType: {
    export: 'NodeModel',
    module: __filename,
  },
});
