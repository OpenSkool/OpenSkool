import {
  Ability,
  AbilityClass,
  AbilityBuilder,
  MongoQuery,
  RawRuleOf,
} from '@casl/ability';

// #region ability types
type AppManageAction = 'manage'; // 'manage' is a special keyword in CASL representing any action
type AppCrudAction = 'create' | 'read' | 'update' | 'delete';
type AppAction = AppManageAction | AppCrudAction;

type AppAllSubject = 'all'; // 'all' is a special keyword in CASL representing any subject
type AppDomainSubject =
  | 'CompetencyFramework'
  | 'Competency'
  | 'Education'
  | 'User';
type AppSubject = AppAllSubject | AppDomainSubject;

export type AppAbility = Ability<[AppAction, AppSubject], MongoQuery>;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the variable the same as the type
export const AppAbility = Ability as AbilityClass<AppAbility>;
export type AppRawRule = RawRuleOf<AppAbility>;
// #endregion

export function buildAbility(userId: string | null): AppAbility {
  const { build, can } = new AbilityBuilder(AppAbility);

  if (userId != null) {
    can('manage', 'all');
  }

  return build();
}