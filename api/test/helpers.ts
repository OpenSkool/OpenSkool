import { Language } from '@prisma/client';

import type { DomainContext } from '../src/domain/context';
import { mapLocaleToLanguageCode } from '../src/domain/helpers/language';
import { prisma } from '../src/prisma';

interface SpecContext {
  domainContext: DomainContext;
  clientHeaders: Record<string, string>;
  languageCode: Language;
  userId: string;
}

export async function createSpecContext({
  locale = 'en',
}: {
  locale?: string;
} = {}): Promise<SpecContext> {
  const person = await prisma.person.create({
    data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
    select: { id: true },
  });
  const languageCode = mapLocaleToLanguageCode(locale);
  return {
    domainContext: {
      locale,
      userId: person.id,
    },
    clientHeaders: createClientHeaders({ locale, userId: person.id }),
    languageCode,
    userId: person.id,
  };
}

export function createClientHeaders({
  locale = 'en',
  userId,
}: {
  locale?: string;
  userId: string;
}): Record<string, string> {
  return {
    'accept-language': locale,
    authorization: `demo-user-id: ${userId}`,
  };
}
