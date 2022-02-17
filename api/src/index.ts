import createApp from 'fastify';

import api from './api';
import boom from './boom';
import config from './config';

const app = createApp({ logger: true })
  .register(config)
  .register(boom)
  .register(api, { prefix: 'api' });

(async (): Promise<void> => {
  await app.ready();
  await app.listen(app.config.PORT);

  const shutdown = () => void app.close();
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})().catch(app.log.error.bind(app.log));
