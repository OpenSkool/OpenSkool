import { useBreakpoints } from '~/hooks/use-breakpoints';

// https://stately.ai/viz/82f45962-5a70-4836-b062-217a1d2dee8b

export interface MenuState {
  opened: boolean;
  overlay: boolean;
}

export function useMenuState(): {
  menuState: MenuState;
  toggleMenu: () => void;
} {
  const breakpoints = useBreakpoints();

  // FSS initial
  const menuState = reactive<MenuState>({
    opened: breakpoints.lg.value,
    overlay: !breakpoints.md.value,
  });

  const router = useRouter();
  router.beforeResolve(() => {
    if (!breakpoints.md.value) {
      menuState.opened = false;
    }
  });

  watch(breakpoints.md, (isMedium) => {
    if (isMedium) {
      // FSS transition GROW_TO_MEDIUM
      menuState.overlay = false;
    } else {
      // FSS transition SHRINK_TO_SMALL
      menuState.opened = false;
      menuState.overlay = true;
    }
  });
  watch(breakpoints.lg, (isLarge) => {
    if (isLarge) {
      // FSS transition GROW_TO_LARGE
      menuState.opened = true;
    }
  });

  return {
    menuState,
    toggleMenu(): void {
      menuState.opened = !menuState.opened;
    },
  };
}
