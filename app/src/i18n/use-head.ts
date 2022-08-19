import { useHead as useOriginalHead, type HeadObject } from '@vueuse/head';
import { useI18n } from 'vue-i18n';

interface GetHeadContext {
  t: ReturnType<typeof useI18n>['t'];
}

export function useHead(getHead: (ctx: GetHeadContext) => HeadObject): void {
  const { t } = useI18n();
  const head = computed(() => getHead({ t }));
  useOriginalHead(head);
}
