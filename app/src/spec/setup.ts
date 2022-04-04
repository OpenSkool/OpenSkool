import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/vue';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';

import 'whatwg-fetch';

import { apolloClient } from '~/api';

import server from './mocks/server';

expect.extend(matchers as any);

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
