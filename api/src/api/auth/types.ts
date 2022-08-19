import { type JWTPayload, decodeJwt } from 'jose';
import { TokenSet } from 'openid-client';
import { z } from 'zod';

const zAccessToken = z.object({
  preferred_username: z.string(),
  realm_access: z.object({
    roles: z.array(z.string()),
  }),
  sub: z.string(),
});

export type AuthAccessToken = JWTPayload & z.infer<typeof zAccessToken>;

export function parseAccessToken(token: JWTPayload | string): AuthAccessToken {
  const decoded = typeof token === 'string' ? decodeJwt(token) : token;
  return { ...decoded, ...zAccessToken.parse(decoded) };
}

export enum AuthRole {
  Administrator = 'administrator',
}

const zTokenSet = z.object({
  access_token: z.string(),
  token_type: z.string(),
  id_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
  session_state: z.string(),
  scope: z.string(),
});

export type AuthTokenSet = TokenSet & z.infer<typeof zTokenSet>;

export function parseTokenSet(tokenSet: TokenSet): AuthTokenSet {
  return new TokenSet(zTokenSet.parse(tokenSet)) as AuthTokenSet;
}

export interface AuthUser {
  id: string;
  name: string;
  roles: AuthRole[];
}
