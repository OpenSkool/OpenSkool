import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { useDemoStore } from './demo-store';
import { getLocaleString } from './i18n';
import { pinia } from './pinia';

const authLink = setContext(
  (operation, previousContext: { headers?: Record<string, string> }) => {
    const demoStore = useDemoStore(pinia);
    const headers: Record<string, string> = {
      ...previousContext.headers,
      'accept-language': getLocaleString(),
    };
    if (demoStore.demoUserId != null) {
      headers.authorization = `demo-user-id: ${demoStore.demoUserId}`;
    }
    return { headers };
  },
);

const httpLink = createHttpLink({
  credentials: 'include',
  uri: `${import.meta.env.VITE_API_BASE_URL}/graphql`,
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
  link: authLink.concat(httpLink),
});
