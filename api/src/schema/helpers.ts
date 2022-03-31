import { Language } from '@prisma/client';

import { AppError, HTTP_STATUS_BAD_REQUEST } from '../errors';
import { Context } from './context';

export function mapLanguageCodeToLocale(languageCode: Language): string {
  switch (languageCode) {
    default:
      throw new AppError(`unknown language: '${languageCode as string}'`, {
        statusCode: HTTP_STATUS_BAD_REQUEST,
      });
    case Language.EN:
      return 'en';
    case Language.NL:
      return 'nl';
  }
}

export function getLocalizedData<
  T extends { languageCode: Language },
  K extends keyof T,
>(typeName: string, translations: T[], key: K, ctx: Context): string {
  const preferedTranslation = translations.find(
    (translation) => translation.languageCode === ctx.locale,
  );
  let value: unknown;
  if (preferedTranslation == null) {
    if (translations.length === 0) {
      throw new AppError('translation missing', {
        extensions: {
          locale: ctx.locale,
          translationKey: key,
          typeName,
        },
      });
    }
    value = translations[0][key];
  } else {
    value = preferedTranslation[key];
  }
  if (typeof value !== 'string') {
    throw new AppError('translation field missing', {
      extensions: {
        locale: ctx.locale,
        translationKey: key,
        translationValue: value == null ? '[undefined]' : value,
        typeName,
      },
    });
  }
  return value;
}
