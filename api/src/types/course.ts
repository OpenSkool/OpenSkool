import builder from '~/schema/builder';

import { Node } from './node';

export const Course = builder.prismaObject('Course', {
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
});
