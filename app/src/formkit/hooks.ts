import { FormKitVuePlugin } from '@formkit/vue';

import { assert } from '~/utils';

export function useFormkit(): FormKitVuePlugin {
  const app = getCurrentInstance();
  assert(app);
  return app.appContext.config.globalProperties.$formkit as FormKitVuePlugin;
}

export function useInitFormkit(): void {
  const { locale } = useI18n();
  const formkit = useFormkit();
  watchEffect(() => {
    formkit.setLocale(locale.value);
  });
}
