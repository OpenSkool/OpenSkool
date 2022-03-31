import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client/core';
import { Observable } from '@apollo/client/utilities';
import { DefaultApolloClient } from '@vue/apollo-composable';

export interface ApolloNetworkStatus {
  pendingRequestCount: number;
  isPending: boolean;
}

export function useApolloClient(): { status: ApolloNetworkStatus } {
  const { status, statusLink } = useApolloNetworkStatus();
  const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_API_BASE_URL}/graphql`,
  });
  const cache = new InMemoryCache();
  const apolloClient = new ApolloClient({
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    link: statusLink.concat(httpLink),
  });
  provide(DefaultApolloClient, apolloClient);
  return { status };
}

export function useApolloNetworkStatus(): {
  statusLink: ApolloLink;
  status: ApolloNetworkStatus;
} {
  const status = reactive<ApolloNetworkStatus>({
    pendingRequestCount: 0,
    isPending: false,
  });

  const statusLink = new ApolloLink((operation, forward) => {
    status.pendingRequestCount += 1;
    status.isPending = true;

    return new Observable((observer) => {
      forward(operation).subscribe({
        next: observer.next.bind(observer),
        complete() {
          status.pendingRequestCount -= 1;
          if (status.pendingRequestCount === 0) {
            status.isPending = false;
          }
          observer.complete();
        },
      });
    });
  });

  return { statusLink, status };
}
