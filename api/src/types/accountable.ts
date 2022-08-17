import builder from '~/schema/builder';

import { Person } from './person';

interface IAccountable {
  createdAt: Date;
  createdById: string | null;
  updatedAt: Date;
  updatedById: string | null;
}

export const Accountable = builder.interfaceRef<IAccountable>('Accountable');

builder.interfaceType(Accountable, {
  name: 'Accountable',
  description:
    'An accountable resource tracks when and by whom it was created and last updated.',
  fields: (t) => ({
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    createdBy: t.field({
      type: Person,
      async resolve(accountable, _arguments, { inject: { userService } }) {
        return userService.findById(accountable.createdById);
      },
    }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    updatedBy: t.field({
      type: Person,
      async resolve(accountable, _arguments, { inject: { userService } }) {
        return userService.findById(accountable.updatedById);
      },
    }),
  }),
});
