import { Language } from '@prisma/client';

import { AppError, HTTP_STATUS_BAD_REQUEST } from '../../errors';

export function mapLocaleToLanguageCode(locale: string): Language {
  switch (locale) {
    default:
      throw new AppError(`unknown locale: '${locale}'`, {
        statusCode: HTTP_STATUS_BAD_REQUEST,
      });
    case 'en':
      return Language.EN;
    case 'nl':
      return Language.NL;
  }
}
