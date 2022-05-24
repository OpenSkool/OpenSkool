import type { Ref } from 'vue';

import { useMediaQuery } from './use-media-query';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type BreakpointName = keyof typeof breakpoints;

export function useBreakpoints(): Record<BreakpointName, Ref<boolean>> {
  const shortcuts: Record<string, Ref<boolean>> = {};
  for (const [name, width] of Object.entries(breakpoints)) {
    shortcuts[name] = useMediaQuery(`(min-width: ${`${width}px`})`);
  }
  return shortcuts;
}
