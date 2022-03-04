import * as Db from '@prisma/client';

export interface Node {
  id: string;
}

export interface Competency extends Db.Competency {
  translations: Db.CompetencyTranslation[];
}

export type NestedCompetency = Competency;
export type RootCompetency = Competency;

export interface Education extends Db.Education {
  translations: Db.EducationTranslation[];
}

export interface Person extends Db.Person {}

export interface Teacher extends Person {}
