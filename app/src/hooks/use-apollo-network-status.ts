import { ApolloLink } from '@apollo/client/core';
import { Observable } from '@apollo/client/utilities';

export interface ApolloNetworkStatus {
  pendingRequestCount: number;
  isPending: boolean;
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
