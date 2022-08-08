import { AbilityBuilder } from '@casl/ability';
import { AppAbility } from '@os/ability';

import { AuthUser } from '~/api/auth/types';

export function buildAbility(user: AuthUser | null): AppAbility {
  const { build, can } = new AbilityBuilder(AppAbility);

  can('read', ['Competency', 'CompetencyFramework']);

  if (user != null) {
    can('manage', ['Competency', 'CompetencyFramework']);
    can('manage', 'InternshipApplication'); // Verified by instanceId in code
    can('read', 'InternshipInstance', { studentId: user.id });
  }

  return build();
}
