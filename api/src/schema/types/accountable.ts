import * as Db from '@prisma/client';

import { PersonService } from '../../domain';
import builder from '../builder';
import { Person } from './person';

const DELETED_USER: Db.Person = {
  id: '__DELETED_USER__',
  firstName: 'Deleted',
  lastName: 'User',
  role: 'EXTERNAL',
};

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
      async resolve(parent) {
        if (parent.createdById == null) {
          return DELETED_USER;
        }
        const person = await PersonService.findPersonById(parent.createdById);
        return person ?? DELETED_USER;
      },
    }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    updatedBy: t.field({
      type: Person,
      async resolve(parent) {
        if (parent.updatedById == null) {
          return DELETED_USER;
        }
        const person = await PersonService.findPersonById(parent.updatedById);
        return person ?? DELETED_USER;
      },
    }),
  }),
});