import { cleanup } from '@testing-library/vue';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import 'whatwg-fetch';

import { apolloClient } from '~/api';

import server from './mocks/server';

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

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
