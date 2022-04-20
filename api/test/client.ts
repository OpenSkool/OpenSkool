import { createServer } from '@graphql-yoga/common';
import { DocumentNode, GraphQLError } from 'graphql';

import schema from '../src/schema';
import type { Context } from '../src/schema/context';
import { createUserFixture } from './fixtures';

export interface GraphQlResponse<TData> {
  data: TData;
  errors?: GraphQLError[];
  extensions?: Record<string, unknown>;
}

export interface SpecContext {
  locale?: string;
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
  if (spec?.locale != null) {
    headers['accept-language'] = spec.locale;
  }
  const { executionResult } = await yoga.inject<TData, TVariables>({
    document,
    headers,
    serverContext: {
      domain: {
        locale: spec?.locale ?? 'en',
        userId: userId ?? null,
      },
      reply: {} as any,
      request: {} as any,
    },
    variables,
  });
  return executionResult as unknown as GraphQlResponse<TData>;
}
