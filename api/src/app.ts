import createApp from 'fastify';

import apiPlugin from './api';
import logger from './logger';
import boomPlugin from './plugins/boom';
import configPlugin from './plugins/config';

const app = createApp({ logger });

app.register(configPlugin).register(boomPlugin).register(apiPlugin);

export default app;
