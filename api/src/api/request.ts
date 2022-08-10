import { Language } from '@prisma/client';
import acceptLanguageParser from 'accept-language-parser';
import { asValue } from 'awilix';
import type { FastifyLoggerInstance, FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';

import { AppError } from '~/errors';

declare module '@fastify/awilix' {
  interface RequestCradle {
    language: Language;
    logger: FastifyLoggerInstance;
  }
}

export const requestPlugin: FastifyPluginAsync = plugin(async (app) => {
  app.addHook('onRequest', async (request) => {
    const { 'accept-language': acceptLanguage = '' } = request.headers;
    const languageString =
      acceptLanguageParser.pick(['en', 'nl'], acceptLanguage) ?? 'en';
    const language = mapToLanguage(languageString);
    request.diScope.register({
      language: asValue(language),
      logger: asValue(request.log),
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
