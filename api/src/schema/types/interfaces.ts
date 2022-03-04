import * as Db from '@prisma/client';
import { interfaceType } from 'nexus';

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
        const user = await ctx.prisma.person.findUnique({
          where: { id: parent.createdById },
        });
        return user ?? DELETED_USER;
      },
    });
    t.nonNull.dateTime('updatedAt');
    t.nonNull.field('updatedBy', {
      type: 'Person',
      async resolve(parent, argumentz, ctx) {
        if (parent.updatedById == null) {
          return DELETED_USER;
        }
        const user = await ctx.prisma.person.findUnique({
          where: { id: parent.updatedById },
        });
        return user ?? DELETED_USER;
      },
    });
  },
});

export const Node = interfaceType({
  name: 'Node',
  description: 'A node is any resource that can be identified via an ID.',
  definition(t) {
    t.nonNull.id('id', { description: 'A CUID for a resource' });
  },
});
