import { expect, test } from 'vitest';

import app from './app';

test.skip('echo request body', async () => {
  const response = await app
    .inject()
    .post('/echo')
    .body({ message: 'Hello World!' });
  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({ message: 'Hello World!' });
});

test.skip('echo requires message', async () => {
  const response = await app.inject().post('/echo').body({});
  expect(response.statusCode).toBe(400);
});
