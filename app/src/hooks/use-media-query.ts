import type { Ref } from 'vue';

export function useMediaQuery(query: string): Ref<boolean> {
  const mediaQuery = window.matchMedia(query);
  const matches = ref(mediaQuery.matches);
  const update = (): void => {
    matches.value = mediaQuery.matches;
  };
  onMounted(() => void mediaQuery.addEventListener('change', update));
  onBeforeUnmount(() => void mediaQuery.removeEventListener('change', update));
  return matches;
}
