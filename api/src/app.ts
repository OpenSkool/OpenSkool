import shutdownPlugin from '@mgcrea/fastify-graceful-exit';
import requestLogger from '@mgcrea/fastify-request-logger';
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
  disableRequestLogging: true,
  logger,
});

app
  .register(awilixPlugin)
  .register(boomPlugin)
  .register(configPlugin)
  .register(shutdownPlugin);

if (process.env.DISABLE_REQUEST_LOGGING !== 'true') {
  app.register(requestLogger);
}

app.register(apiPlugin);

export default app;
