import { Language } from '@prisma/client';

import { AppError } from '../../errors';

export function mapLocaleToLanguageCode(locale: string): Language {
  switch (locale) {
    default:
      throw new AppError(`unknown locale: '${locale}'`);
    case 'en':
      return Language.EN;
    case 'nl':
      return Language.NL;
  }
}
