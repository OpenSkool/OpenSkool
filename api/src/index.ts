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
})().catch(app.log.error);
