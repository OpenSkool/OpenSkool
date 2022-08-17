import { AbilityBuilder } from '@casl/ability';
import { AppAbility } from '@os/ability';

import { AuthRole, AuthUser } from './types';

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
