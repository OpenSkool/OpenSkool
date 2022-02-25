import { cleanup } from '@testing-library/vue';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { apolloClient } from '~/api';

import server from './mocks/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  // Reset MSW handlers
  server.resetHandlers();
  // Reset GraphQL store
  apolloClient.clearStore();
  // Clean up the DOM
  cleanup();
});

afterAll(() => void server.close());
