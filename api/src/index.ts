import createApp from 'fastify';

import apiPlugin from './api';
import boomPlugin from './boom';
import configPlugin from './config';

const app = createApp({ logger: true })
  .register(configPlugin)
  .register(boomPlugin)
  .register(apiPlugin);

(async (): Promise<void> => {
  await app.ready();
  await app.listen(app.config.PORT);

  const shutdown = () => void app.close();
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})().catch(app.log.error.bind(app.log));
