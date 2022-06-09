import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { setSessionExpirationTimer } from '~/auth';

import { i18nService } from './i18n';

const enrichLink = setContext(
  (operation, previousContext: { headers?: Record<string, string> }) => {
    const headers: Record<string, string> = {
      ...previousContext.headers,
      'accept-language': i18nService.getLocaleString(),
    };
    return { headers };
  },
);

const httpLink = createHttpLink({
  credentials: 'include',
  uri: new URL('./graphql', import.meta.env.VITE_API_BASE_URL).toString(),
});

const sessionWatchLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    setSessionExpirationTimer();
    return response;
  });
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
  link: enrichLink.concat(sessionWatchLink).concat(httpLink),
});
