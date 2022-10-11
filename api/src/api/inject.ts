import { Language } from '@prisma/client';
import acceptLanguageParser from 'accept-language-parser';
import { asFunction, asValue } from 'awilix';
import type {
	FastifyBaseLogger,
	FastifyInstance,
	FastifyPluginAsync,
	FastifyRequest,
} from 'fastify';
import plugin from 'fastify-plugin';

import { AppError } from '~/errors';
import type { AppCradle } from '~/plugins/awilix';

declare module '@fastify/awilix' {
	interface Cradle {
		app: FastifyInstance;
		logger: FastifyBaseLogger;
	}
	interface RequestCradle {
		language: Language;
		request: FastifyRequest;
	}
}

export const injectPlugin: FastifyPluginAsync = plugin(async (app) => {
	app.diContainer.register('app', asValue(app));

	function getLanguage({ request }: AppCradle): Language {
		const { 'accept-language': acceptLanguage = '' } = request.headers;
		const languageString =
			acceptLanguageParser.pick(['en', 'nl'], acceptLanguage) ?? 'en';
		return mapToLanguage(languageString);
	}

	app.addHook('onRequest', async (request) => {
		request.diScope.register({
			language: asFunction(getLanguage, { lifetime: 'SINGLETON' }),
			request: asValue(request),
		});
	});
});

function mapToLanguage(locale: string): Language {
	switch (locale) {
		default:
			throw new AppError(`unknown locale: '${locale}'`);
		case 'en':
			return Language.EN;
		case 'nl':
			return Language.NL;
	}
}
