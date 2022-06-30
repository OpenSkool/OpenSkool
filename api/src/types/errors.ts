import {
  AppInputError,
  AppNotFoundError,
  AppUnauthorizedError,
  AppUserError,
} from '~/errors';
import builder from '~/schema/builder';

const UserError = builder.interfaceType(AppUserError, {
  name: 'UserError',
  fields: (t) => ({
    code: t.exposeString('code'),
    message: t.exposeString('message'),
    path: t.stringList({
      nullable: true,
      resolve: (error) => error.metadata?.path,
    }),
  }),
});

builder.objectType(AppInputError, {
  name: 'InputError',
  interfaces: [UserError],
});

builder.objectType(AppNotFoundError, {
  name: 'NotFoundError',
  interfaces: [UserError],
});

builder.objectType(AppUnauthorizedError, {
  name: 'UnauthorizedError',
  interfaces: [UserError],
});
