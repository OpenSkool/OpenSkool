import { render } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { test } from 'vitest';

import { apolloClient } from '~/api';

import DataFetching from './data-fetching.vue';

test('should fetch and render educations', async () => {
  const { findAllByRole, getByRole } = render(DataFetching, {
    global: { provide: { [DefaultApolloClient]: apolloClient } },
  });
  getByRole('list');
  await findAllByRole('listitem');
});
