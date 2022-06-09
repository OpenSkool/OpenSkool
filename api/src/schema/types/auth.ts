import assert from 'node:assert';

import { decodeJwt, JWTPayload } from 'jose';
import ms from 'ms';
import type { JsonObject } from 'type-fest';

import { AppRawRule } from '~/api/ability';
import type { Auth, AuthUser } from '~/api/auth';
import { AppTokenSet } from '~/api/openid';
import { castArray } from '~/utils';

import builder from '../builder';
import { Node } from './node';

const AbilityRule = builder.objectRef<AppRawRule>('AbilityRule');

export const CurrentUser = builder.objectRef<AuthUser>('CurrentUser');

const JWT = builder.objectRef<JWTPayload>('JWT');

const TokenSet = builder.objectRef<AppTokenSet>('TokenSet');

builder.objectType(AbilityRule, {
  name: 'AbilityRule',
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

builder.objectType(CurrentUser, {
  name: 'CurrentUser',
  description: 'The currently authenticated user',
  interfaces: [Node],
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    tokenSet: t.field({
      type: TokenSet,
      resolve(parent, argumentz, { request }) {
        assert(request.session.openId.tokenSet, 'missing token set');
        return request.session.openId.tokenSet;
      },
    }),
  }),
});

builder.objectType(JWT, {
  name: 'JWT',
  fields: (t) => ({
    expiresAt: t.field({
      type: 'DateTime',
      nullable: true,
      resolve: (jwt) => dateFromJwtTimestamp(jwt.exp),
    }),
    expiresIn: t.string({
      nullable: true,
      resolve: (jwt) => {
        const expiredAt = dateFromJwtTimestamp(jwt.exp);
        return expiredAt == null
          ? null
          : (expiredAt.getTime() - Date.now()).toString();
      },
    }),
    issuedAgo: t.string({
      nullable: true,
      resolve: (jwt) => {
        const issuedAt = dateFromJwtTimestamp(jwt.iat);
        return issuedAt == null ? null : ms(Date.now() - issuedAt.getTime());
      },
    }),
    issuedAt: t.field({
      type: 'DateTime',
      nullable: true,
      resolve: (jwt) => dateFromJwtTimestamp(jwt.iat),
    }),
    issuer: t.string({ nullable: true, resolve: (jwt) => jwt.iss }),
    subject: t.string({ nullable: true, resolve: (jwt) => jwt.sub }),
  }),
});

builder.objectType(TokenSet, {
  name: 'TokenSet',
  fields: (t) => ({
    accessToken: t.field({
      type: JWT,
      resolve: (tokenSet) => decodeJwt(tokenSet.access_token),
    }),
    idToken: t.field({
      type: JWT,
      resolve: (tokenSet) => decodeJwt(tokenSet.id_token),
    }),
    refreshToken: t.field({
      type: JWT,
      resolve: (tokenSet) => decodeJwt(tokenSet.refresh_token),
    }),
  }),
});

const AuthRef = builder.objectRef<Auth>('Auth');

builder.objectType(AuthRef, {
  name: 'Auth',
  fields: (t) => ({
    abilityRules: t.field({
      type: [AbilityRule],
      resolve(auth, argumentz, { request }) {
        return auth.ability.rules;
      },
    }),
    currentUser: t.expose('user', { nullable: true, type: CurrentUser }),
  }),
});

builder.queryField('auth', (t) =>
  t.field({
    type: AuthRef,
    async resolve(root, argumentz, ctx) {
      return ctx.request.auth;
    },
  }),
);

function dateFromJwtTimestamp(timestamp: number | undefined): Date | null {
  return timestamp == null ? null : new Date(timestamp * ms('1s'));
}
