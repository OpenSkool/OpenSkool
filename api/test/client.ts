import type { IncomingHttpHeaders } from 'http';

import { DocumentNode, GraphQLError } from 'graphql';
import { createMercuriusTestClient } from 'mercurius-integration-testing';

import app from '../src/app';
import { createPersonFixture } from './fixtures';

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
  const client = createMercuriusTestClient(app);
  const headers: IncomingHttpHeaders = {};
  if (spec == null || spec.userId !== false) {
    const { id: userId } =
      spec?.userId == null ? await createPersonFixture() : { id: spec.userId };
    headers.authorization = `demo-user-id: ${userId}`;
  }
  if (spec?.locale != null) {
    headers['accept-language'] = spec.locale;
  }
  client.setHeaders(headers);
  return client.query<TData, TVariables>(document, { variables });
}
