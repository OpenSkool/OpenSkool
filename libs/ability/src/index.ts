import { AbilityClass, RawRuleOf } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';
import {
  Competency,
  CompetencyFramework,
  InternshipApplication,
  InternshipInstance,
  InternshipPosition,
} from '@prisma/client';

export { accessibleBy } from '@casl/prisma';
export { subject } from '@casl/ability';

type AppManageAction = 'manage'; // 'manage' is a special keyword in CASL representing any action
type AppCrudAction = 'create' | 'read' | 'update' | 'delete';
type AppAction = AppManageAction | AppCrudAction;

type AppAllSubject = 'all'; // 'all' is a special keyword in CASL representing any subject
type PrismaSubjects = Subjects<{
  Competency: Competency;
  CompetencyFramework: CompetencyFramework;
  InternshipApplication: InternshipApplication;
  InternshipInstance: InternshipInstance;
  InternshipPosition: InternshipPosition;
}>;
type AppSubject = AppAllSubject | PrismaSubjects;

export type AppAbility = PrismaAbility<[AppAction, AppSubject]>;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the variable the same as the type
export const AppAbility = PrismaAbility as AbilityClass<AppAbility>;

export type AppRawRule = RawRuleOf<AppAbility>;
