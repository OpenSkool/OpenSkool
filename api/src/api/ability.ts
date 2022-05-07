import { AbilityBuilder } from '@casl/ability';
import { AppAbility } from '@os/ability';

export type { AppRawRule } from '@os/ability';
export { AppAbility } from '@os/ability';

export function buildAbility(userId: string | null): AppAbility {
  const { build, can } = new AbilityBuilder(AppAbility);

  if (userId != null) {
    can('manage', 'all');
  }

  return build();
}
