import shutdownPlugin from '@mgcrea/fastify-graceful-exit';
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
	.register(shutdownPlugin)
	.register(apiPlugin);

export default app;
