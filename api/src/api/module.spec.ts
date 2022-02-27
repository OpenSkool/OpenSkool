import { beforeAll, expect, test } from 'vitest';

import app from '../app';

beforeAll(() => app.ready());

test('echo request body', async () => {
  const response = await app
    .inject()
    .post('/echo')
    .body({ message: 'Hello World!' });
  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({ message: 'Hello World!' });
});

test('echo requires message', async () => {
  const response = await app.inject().post('/echo').body({});
  expect(response.statusCode).toBe(400);
});
