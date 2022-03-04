import { interfaceType } from 'nexus';

export const Accountable = interfaceType({
  name: 'Accountable',
  description:
    'An accountable resource tracks when and by whom it was created and last updated.',
  definition(t) {
    t.nonNull.dateTime('createdAt');
    t.nonNull.dateTime('updatedAt');
  },
});

export const Node = interfaceType({
  name: 'Node',
  description: 'A node is any resource that can be identified via an ID.',
  definition(t) {
    t.nonNull.id('id', { description: 'A CUID for a resource' });
  },
});
