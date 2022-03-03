import * as P from '@prisma/client';

export interface Node {
  id: string;
}

export interface Competency extends P.Competency {
  translations: P.CompetencyTranslation[];
}

export interface Education extends P.Education {
  translations: P.EducationTranslation[];
}
