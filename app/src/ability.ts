import { Ability, AbilityClass, RawRuleOf } from '@casl/ability';
import { useAbility } from '@casl/vue';

type AppManageAction = 'manage'; // 'manage' is a special keyword in CASL representing any action
type AppCrudAction = 'create' | 'read' | 'update' | 'delete';
type AppAction = AppManageAction | AppCrudAction;

type AppAllSubject = 'all'; // 'all' is a special keyword in CASL representing any subject
type AppSubject =
  | AppAllSubject
  | 'Competency'
  | 'CompetencyFramework'
  | 'InternshipApplication'
  | 'InternshipInstance'
  | 'InternshipPosition';

export type AppAbility = Ability<[AppAction, AppSubject]>;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the variable the same as the type
export const AppAbility = Ability as AbilityClass<AppAbility>;

export type AppRawRule = RawRuleOf<AppAbility>;

export { abilitiesPlugin as casl } from '@casl/vue';

export function useAppAbility(): AppAbility {
  return useAbility<AppAbility>();
}
