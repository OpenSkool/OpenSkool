import { camelCase } from '~/utils';

import { Loader } from './types';

export interface ParsedGlobEntry {
  namespace: string;
  locale: string;
  loader: Loader;
}

export function parseLocalesGlob(
  globResult: Record<string, Loader>,
): ParsedGlobEntry[] {
  return Object.entries(globResult).map(([filepath, loader]) => {
    const match = filepath.match(/\/(?<namespace>\w+)\.(?<locale>\w+)\.yaml$/);
    if (match == null) {
      throw new Error(
        `failed to match locales glob entry at '${filepath}' to format of '[namespace].[locale].yaml'`,
      );
    }
    const { locale, namespace } = match.groups as {
      locale: string;
      namespace: string;
    };
    return { namespace: camelCase(namespace), locale, loader };
  });
}
