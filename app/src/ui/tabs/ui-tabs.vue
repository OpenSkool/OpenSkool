<template>
  <TabGroup as="div" class="space-y-3">
    <TabList v-if="$slots.default" class="p-1 pb-2 test">
      <Tab
        v-for="(slot, index) in $slots.default()"
        v-slot="{ selected }"
        :key="`slot-${index}`"
        as="template"
      >
        <button
          class="rounded-t-sm font-semibold border-b-2 text-sm py-2 px-8 text-primary-600 select-none whitespace-nowrap uppercase focus:outline-none focus-visible:(ring-2 ring-offset-5 ring-primary-700) "
          :class="
            selected ? 'border-b-primary-400' : 'border-b-transparent-300'
          "
        >
          {{ slot.props?.title }}
        </button>
      </Tab>
    </TabList>
    <TabPanels class="focus:outline-none focus-visible:(ring-2 ring-dark-700) ">
      <slot />
    </TabPanels>
  </TabGroup>
</template>
