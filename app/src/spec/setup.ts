import { cleanup } from '@testing-library/vue';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import 'whatwg-fetch';

import { apolloClient } from '~/apollo';

import server from './mocks/server';

// These imports trigger Vitest / `unplugin-vue-components` to register all
// components that don't have tests.
// https://github.com/antfu/unplugin-vue-components/issues/380
import '~/domain/global/components/root-layout.vue';
import '~/pages/demo/forms.vue';
import '~/pages/demo/ui.vue';

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
