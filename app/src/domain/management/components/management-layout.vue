<script lang="ts" setup>
import { Menu, MenuItem } from '@headlessui/vue';
import { cloneVNode, VNode } from 'vue';

import { useBreakpoints } from '~/hooks/use-breakpoints';
import { createButtonStyles } from '~/ui/button/helpers';

const breakpoints = useBreakpoints();
const isDesktop = breakpoints.md;

const slots = useSlots();
const ActionsNode = computed(() => {
  if (slots.actions == null) {
    return;
  }
  const actionNodes = slots.actions();
  return {
    functional: true,
    render(): VNode | VNode[] {
      return isDesktop.value
        ? actionNodes.map(
            (node: VNode): VNode =>
              cloneVNode(node, {
                class: [
                  createButtonStyles({
                    color: 'primary',
                    size: breakpoints['2xl'].value ? 'base' : 'sm',
                  }),
                  'w-full',
                ],
              }),
          )
        : actionNodes.map((node) =>
            // @ts-expect-error MenuItem is not typed with slot props
            h(MenuItem, { as: 'div' }, ({ active }: { active: boolean }) =>
              cloneVNode(node, {
                class: [
                  'osml-fab-item',
                  active ? 'osml-fab-item--active' : null,
                ].filter(Boolean),
              }),
            ),
          );
    },
  };
});
</script>

<template>
  <div class="rounded-md grid gap-5 osml-grid">
    <UiCard v-if="isDesktop" class="p-5">
      <div class="space-y-3">
        <ActionsNode />
      </div>
    </UiCard>
    <div :class="isDesktop ? 'col-span-1' : 'col-span-2'">
      <slot />
    </div>
  </div>
  <div v-show="false" class="fab-item" />
  <Menu v-if="!isDesktop" v-slot="{ open }" as="div">
    <div class="m-10 right-0 bottom-0 fixed">
      <div class="relative">
        <div class="transform right-0 bottom-0 absolute">
          <Transition
            enter-active-class="transform origin-bottom-right transition duration-100 ease-out"
            enter-from-class="scale-95 translate-y-6 opacity-0"
            enter-to-class="scale-100 translate-y-0 opacity-100"
            leave-active-class="transform origin-bottom-right transition duration-75 ease-in"
            leave-from-class="scale-100 translate-y-0 opacity-100"
            leave-to-class="scale-95 translate-y-6 opacity-0"
          >
            <MenuItems class="focus:outline-none">
              <div class="space-y-1 mr-5px mb-2">
                <ActionsNode />
              </div>
            </MenuItems>
          </Transition>
        </div>
      </div>
      <MenuButton
        class="rounded-full shadow-md text-lg text-white p-3 shadow-dark-100/50 focus:outline-none focus-visible:(ring-2 ring-secondary-300 ring-offset-2) "
        :class="open ? 'bg-gray-500' : 'bg-primary-500'"
      >
        <RiCloseLine v-if="open" aria-hidden />
        <RiMenuAddLine v-else aria-hidden />
      </MenuButton>
    </div>
  </Menu>
</template>

<style>
.osml-grid {
  grid-template-columns: minmax(25%, 25ch) 1fr;
}
.osml-fab-item {
  @apply flex flex-row-reverse text-sm py-1 gap-3 items-center justify-start;
}
.osml-fab-item .osml-item__label {
  @apply rounded-sm bg-dark-500 shadow-md text-white py-1 px-2;
  min-width: max-content;
}
.osml-fab-item.osml-fab-item--active .osml-item__label {
  @apply shadow-xl;
}
.osml-fab-item .osml-item__label::after {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M16 12l-6 6V6z'/%3E%3C/svg%3E");
  width: 24px;
  height: 24px;
  position: absolute;
  transform: translate(-3px, -2px);
}
.osml-fab-item .osml-item__icon {
  @apply rounded-full bg-gray-300 flex-shrink-0 shadow-md text-black p-3;
}
.osml-fab-item.osml-fab-item--active .osml-item__icon {
  @apply bg-primary-200 text-black;
}
</style>
