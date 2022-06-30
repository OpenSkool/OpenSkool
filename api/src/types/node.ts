import builder from '~/schema/builder';

export const Node = builder.interfaceRef<{ id: string }>('Node');

builder.interfaceType(Node, {
  name: 'Node',
  description: 'A node is any resource that can be identified via an ID.',
  fields: (t) => ({
    id: t.exposeID('id', { description: 'A CUID for a resource' }),
  }),
});
