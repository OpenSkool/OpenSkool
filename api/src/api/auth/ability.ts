import {
  AbilityBuilder,
  type AbilityClass,
  type RawRuleOf,
} from '@casl/ability';
import { PrismaAbility, type Subjects } from '@casl/prisma';
import type {
  Competency,
  CompetencyFramework,
  InternshipApplication,
  InternshipInstance,
  InternshipPosition,
} from '@prisma/client';

import { AuthRole, type AuthUser } from './types';

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

export function buildAbility(user: AuthUser | null): AppAbility {
  const { build, can } = new AbilityBuilder(AppAbility);

  can('read', ['Competency', 'CompetencyFramework']);

  if (user == null) {
    return build();
  }

  if (user.roles.includes(AuthRole.Administrator)) {
    can('manage', ['Competency', 'CompetencyFramework', 'InternshipPosition']);
  }

  can('manage', 'InternshipApplication'); // Verified by instanceId in code
  can('read', 'InternshipInstance', { studentId: user.id });

  return build();
}
