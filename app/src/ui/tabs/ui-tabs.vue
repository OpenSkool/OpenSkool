<script lang="ts" setup></script>

<template>
  <TabGroup>
    <TabList v-if="$slots.default" class="bg-white flex gap-3">
      <Tab v-for="slot in $slots.default()" :key="slot.props?.id">{{
        slot.props?.title
      }}</Tab>
    </TabList>
    <TabPanels>
      <slot />
    </TabPanels>
  </TabGroup>
</template>
