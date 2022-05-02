import type { AuthUser } from '../../api/auth';
import builder from '../builder';
import { Node } from './node';

export const CurrentUser = builder.objectRef<AuthUser>('CurrentUser');

builder.objectType(CurrentUser, {
  name: 'CurrentUser',
  description: 'The currently authenticated user',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
});

builder.queryField('currentUser', (t) =>
  t.field({
    type: CurrentUser,
    nullable: true,
    async resolve(root, argumentz, ctx) {
      return ctx.request.session.auth.user;
    },
  }),
);
