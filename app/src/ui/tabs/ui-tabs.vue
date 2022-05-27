<template>
  <TabGroup>
    <TabList
      v-if="$slots.default"
      id="tablist"
      class="flex gap-6 p-2 overflow-x-auto"
    >
      <Tab
        v-for="(slot, index) in $slots.default()"
        v-slot="{ selected }"
        :key="`slot-${index}`"
        as="template"
      >
        <button
          class="border-b-3 inline-flex items-center font-semibold select-none text-base py-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-primary-600 uppercase whitespace-nowrap"
          :class="[
            selected ? ' border-b-secondary-300' : 'border-b-transparent',
          ]"
        >
          {{ slot.props?.title }}
        </button>
      </Tab>
    </TabList>
    <TabPanels>
      <slot />
    </TabPanels>
  </TabGroup>
</template>
