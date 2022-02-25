import { render } from '@testing-library/vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { expect, test } from 'vitest';

import { apolloClient } from '~/api';

import HelloWorld from './hello-world.vue';

test('should render title', async () => {
  const { getByRole } = render(HelloWorld, {
    global: { provide: { [DefaultApolloClient]: apolloClient } },
    props: { msg: 'Hello One!' },
  });
  const heading = getByRole('heading');
  expect(heading.textContent).toBe('Hello One!');
});

test('should fetch and render educations', async () => {
  const { findAllByRole, getByRole } = render(HelloWorld, {
    global: { provide: { [DefaultApolloClient]: apolloClient } },
    props: { msg: 'Hello Two!' },
  });

  getByRole('list');
  await findAllByRole('listitem');
});
