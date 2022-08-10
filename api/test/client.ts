import { createServer } from '@graphql-yoga/common';
import { Language } from '@prisma/client';
import { asValue, createContainer } from 'awilix';
import { FastifyRequest } from 'fastify';
import { DocumentNode, GraphQLError } from 'graphql';

import { AuthRole, buildAbility } from '~/api/auth';
import { registerDomainServices } from '~/domain';
import type { AppCradle } from '~/plugins/awilix';
import schema from '~/schema';
import type { Context } from '~/schema/context';

import { createUserFixture } from './fixtures';

export interface GraphQlResponse<TData> {
  data: TData;
  errors?: GraphQLError[];
  extensions?: Record<string, unknown>;
}

export interface SpecContext {
  locale?: Language;
  userId?: string | false;
}

export async function execute<
  TData extends Record<string, unknown>,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  document: DocumentNode,
  { spec, variables }: { spec?: SpecContext; variables?: TVariables },
): Promise<GraphQlResponse<TData>> {
  const yoga = createServer<Context>({
    maskedErrors: false,
    schema,
  });
  const headers: HeadersInit = {};
  let userId: string | null = null;
  if (spec?.userId == null) {
    const user = await createUserFixture();
    userId = user.id;
  } else if (spec.userId !== false) {
    userId = spec.userId;
  }
  const user =
    userId == null
      ? null
      : {
          id: userId,
          name: 'Test User',
          roles: [AuthRole.Administrator],
        };
  if (spec?.locale != null) {
    headers['accept-language'] = spec.locale;
  }
  const container = createContainer<AppCradle>()
    .register('auth', asValue({ ability: buildAbility(user), user }))
    .register('language', asValue(spec?.locale ?? Language.EN));
  registerDomainServices(container);
  const { executionResult } = await yoga.inject<TData, TVariables>({
    document,
    headers,
    serverContext: {
      inject: container.cradle,
      request: { diScope: container } as unknown as FastifyRequest,
    },
    variables,
  });
  return executionResult as unknown as GraphQlResponse<TData>;
}
