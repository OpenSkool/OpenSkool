import type { JsonObject } from 'type-fest';

import { AppRawRule } from '~/api/ability';
import type { AuthUser } from '~/api/auth';
import { castArray } from '~/utils';

import builder from '../builder';
import { Node } from './node';

export const CurrentUser = builder.objectRef<AuthUser>('CurrentUser');

export const CurrentUserAbilityRule = builder.objectRef<AppRawRule>(
  'CurrentUserAbilityRule',
);

builder.objectType(CurrentUser, {
  name: 'CurrentUser',
  description: 'The currently authenticated user',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    abilityRules: t.field({
      type: [CurrentUserAbilityRule],
      resolve(parent, argumentz, { request }) {
        return request.auth.ability.rules;
      },
    }),
  }),
});

builder.objectType(CurrentUserAbilityRule, {
  name: 'CurrentUserAbilityRule',
  fields: (t) => ({
    action: t.stringList({
      resolve(abilityRule) {
        return castArray(abilityRule.action);
      },
    }),
    conditions: t.field({
      type: 'JSON',
      nullable: true,
      resolve(abilityRule) {
        return abilityRule.conditions as JsonObject;
      },
    }),
    fields: t.stringList({
      nullable: true,
      resolve(parent) {
        return parent.fields == null ? null : castArray(parent.fields);
      },
    }),
    inverted: t.boolean({
      resolve(abilityRule) {
        return abilityRule.inverted ?? false;
      },
    }),
    reason: t.exposeString('reason', { nullable: true }),
    subject: t.stringList({
      resolve(abilityRule) {
        return castArray(abilityRule.subject);
      },
    }),
  }),
});

builder.queryField('currentUser', (t) =>
  t.field({
    type: CurrentUser,
    nullable: true,
    async resolve(root, argumentz, ctx) {
      return ctx.request.auth.user;
    },
  }),
);
