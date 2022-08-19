import { useAbility } from '@casl/vue';
import type { AppAbility } from '@os/ability';

export type { AppRawRule } from '@os/ability';
export { AppAbility } from '@os/ability';

export { abilitiesPlugin as casl } from '@casl/vue';

export function useAppAbility(): AppAbility {
  return useAbility<AppAbility>();
}
