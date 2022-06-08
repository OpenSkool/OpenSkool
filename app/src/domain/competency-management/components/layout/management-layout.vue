<script lang="ts" setup>
import { useBreakpoints } from '~/hooks/use-breakpoints';
import { ActionItem } from '~/types';

const props = defineProps<{
  actions: ActionItem[];
  actionsLabel: string;
}>();

const breakpoints = useBreakpoints();
const showAside = breakpoints.lg;

const ableActions = computed(() => {
  return props.actions.filter((action) => action.hasPermission);
});
</script>

<template>
  <div class="flex items-stretch">
    <div v-if="showAside" class="bg-white w-1/3">
      <ol
        :aria-label="actionsLabel"
        aria-orientation="vertical"
        :class="[
          'flex flex-col items-stretch',
          'focus:outline-none focus-visible:(ring-2 ring-secondary-300 ring-offset-2)',
        ]"
        role="menubar"
      >
        <li
          v-for="(action, index) in ableActions"
          :key="`button${index}`"
          class="px-5"
          role="presentation"
        >
          <UiButtonRouterLink
            v-if="typeof action.action === 'string'"
            class="my-3 w-full"
            role="menuitem"
            :size="breakpoints.lg.value ? 'base' : 'sm'"
            :to="action.action"
          >
            <UiRemixIcon :icon="action.icon" /> {{ action.title }}
          </UiButtonRouterLink>
          <UiButton
            v-else
            class="my-3 w-full"
            role="menuitem"
            :size="breakpoints.lg.value ? 'base' : 'sm'"
            @click="action.action"
          >
            <UiRemixIcon :icon="action.icon" /> {{ action.title }}
          </UiButton>
        </li>
      </ol>
    </div>
    <slot />
    <div v-if="!showAside">
      <UiFab
        v-if="ableActions.length > 0"
        :actions="ableActions"
        :actions-label="actionsLabel"
        class="absolute bottom-10 right-10"
      />
    </div>
  </div>
</template>
