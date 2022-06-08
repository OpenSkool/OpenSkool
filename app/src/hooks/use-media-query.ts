import type { Ref } from 'vue';

export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(true);
  if (!('matchMedia' in window)) {
    return matches;
  }
  const mediaQuery = window.matchMedia(query);
  const update = (): void => {
    matches.value = mediaQuery.matches;
  };
  update();
  onMounted(() => void mediaQuery.addEventListener('change', update));
  onBeforeUnmount(() => void mediaQuery.removeEventListener('change', update));
  return matches;
}
