import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { useDemoStore } from './demo-store';
import { pinia } from './pinia';

const authLink = setContext(
  (operation, previousContext: { headers?: Record<string, string> }) => {
    const demoStore = useDemoStore(pinia);

    return {
      headers: {
        ...previousContext.headers,
        authorization:
          demoStore.demoUserId == null
            ? undefined
            : `demo-user-id: ${demoStore.demoUserId}`,
      },
    };
  },
);

const httpLink = createHttpLink({
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
