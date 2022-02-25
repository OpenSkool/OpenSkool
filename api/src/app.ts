import createApp from 'fastify';

import apiPlugin from './api';
import boomPlugin from './boom';
import configPlugin from './config';

export default createApp({ logger: true })
  .register(configPlugin)
  .register(boomPlugin)
  .register(apiPlugin);
