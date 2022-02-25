import createApp from 'fastify';

import apiPlugin from './api/module';
import boomPlugin from './boom';
import configPlugin from './config';

const app = createApp({
  logger: {
    level: process.env.NODE_ENV === 'test' ? 'error' : 'info',
    prettyPrint: process.env.NODE_ENV !== 'production',
  },
});

app.register(configPlugin).register(boomPlugin).register(apiPlugin);

export default app;
