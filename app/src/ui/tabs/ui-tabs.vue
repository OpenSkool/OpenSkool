<template>
  <TabGroup as="div" class="space-y-3">
    <TabList v-if="$slots.default" class="test p-1 pb-2">
      <Tab
        v-for="(slot, index) in $slots.default()"
        v-slot="{ selected }"
        :key="`slot-${index}`"
        as="template"
      >
        <button
          :class="[
            'px-5 py-2 select-none whitespace-nowrap',
            'font-semibold text-sm text-primary-600 uppercase border-b-2',
            selected ? 'border-b-secondary-300' : 'border-b-transparent-300',
            'rounded-t-sm focus:outline-none focus-visible:ring-2',
          ]"
        >
          {{ slot.props?.title }}
        </button>
      </Tab>
    </TabList>
    <TabPanels class="focus:outline-none focus-visible:(ring-2 ring-offset-2)">
      <slot />
    </TabPanels>
  </TabGroup>
</template>
