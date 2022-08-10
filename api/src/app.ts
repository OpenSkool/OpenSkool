import createApp from 'fastify';

import apiPlugin from '~/api';
import logger from '~/logger';
import awilixPlugin from '~/plugins/awilix';
import boomPlugin from '~/plugins/boom';
import configPlugin from '~/plugins/config';

const app = createApp({
  ajv: {
    customOptions: {
      keywords: ['kind', 'modifier'],
      strict: 'log',
    },
  },
  disableRequestLogging: process.env.DISABLE_REQUEST_LOGGING === 'true',
  logger,
});

app
  .register(awilixPlugin)
  .register(boomPlugin)
  .register(configPlugin)
  .register(apiPlugin);

export default app;
