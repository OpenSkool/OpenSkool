import createApp from 'fastify';

import config from './config';

const app = createApp({ logger: true }).register(config);

(async (): Promise<void> => {
  await app.ready();
  await app.listen(app.config.PORT);
})().catch(app.log.error);
