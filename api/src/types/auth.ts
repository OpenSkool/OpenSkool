import assert from 'node:assert';

import { decodeJwt, type JWTPayload } from 'jose';
import ms from 'ms';
import type { JsonObject } from 'type-fest';
import { z } from 'zod';

import type { AppRawRule, Auth, AuthTokenSet, AuthUser } from '~/api/auth';
import builder from '~/schema/builder';
import { castArray } from '~/utils';

import { Node } from './node';

const AbilityRule = builder.objectRef<AppRawRule>('AbilityRule');

export const CurrentUser = builder.objectRef<AuthUser>('CurrentUser');

const zJwtPayload = z.object({
  exp: z.number(),
  iat: z.number(),
  iss: z.string(),
  sub: z.string(),
});

const JWT = builder.objectRef<JWTPayload & z.infer<typeof zJwtPayload>>('JWT');

const TokenSet = builder.objectRef<AuthTokenSet>('TokenSet');

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
      resolve(user, _arguments, { request }) {
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
      resolve: (jwt) => dateFromJwtTimestamp(jwt.exp),
    }),
    expiresIn: t.string({
      description:
        'This field is for debugging purposes. If you need to know the expiration time of the JWT, use the `expiresAt` field.',
      resolve: (jwt) =>
        ms(dateFromJwtTimestamp(jwt.exp).getTime() - Date.now()),
    }),
    issuedAgo: t.string({
      description:
        'This field is for debugging purposes. If you need to know the expiration time of the JWT, use the `issuedAt` field.',
      resolve: (jwt) => {
        return ms(Date.now() - dateFromJwtTimestamp(jwt.iat).getTime());
      },
    }),
    issuedAt: t.field({
      type: 'DateTime',
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
      resolve(tokenSet) {
        return zJwtPayload.parse(decodeJwt(tokenSet.access_token));
      },
    }),
    idToken: t.field({
      type: JWT,
      resolve(tokenSet) {
        return zJwtPayload.parse(decodeJwt(tokenSet.id_token));
      },
    }),
    refreshToken: t.field({
      type: JWT,
      resolve(tokenSet) {
        return zJwtPayload.parse(decodeJwt(tokenSet.refresh_token));
      },
    }),
  }),
});

const AuthRef = builder.objectRef<Auth>('Auth');

builder.objectType(AuthRef, {
  name: 'Auth',
  fields: (t) => ({
    abilityRules: t.field({
      type: [AbilityRule],
      resolve(auth, _arguments, { request }) {
        return auth.ability.rules;
      },
    }),
    currentUser: t.expose('user', { nullable: true, type: CurrentUser }),
  }),
});

builder.queryField('auth', (t) =>
  t.field({
    type: AuthRef,
    async resolve(root, _arguments, { inject: { auth } }) {
      return auth;
    },
  }),
);

function dateFromJwtTimestamp(timestamp: number): Date {
  return new Date(timestamp * ms('1s'));
}
