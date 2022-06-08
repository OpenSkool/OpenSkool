<script lang="ts" setup>
import VSwitch from './v-switch';

defineProps<{
  icon: string;
}>();
</script>

<template>
  <VSwitch :value="icon">
    <template #ri-add-line>
      <RiAddLine aria-hidden />
    </template>
    <template #ri-delete-bin-line>
      <RiDeleteBinLine aria-hidden />
    </template>
    <template #ri-arrow-up-down-line>
      <RiArrowUpDownLine aria-hidden />
    </template>
    <template #default>
      <RiQuestionMark aria-hidden />
    </template>
  </VSwitch>
</template>

<!-- <script lang="ts" setup>
import icons from '@iconify-json/ri/icons.json';

const icon = computed(() => {
  console.log(icons.icons['add-line'].body);
  return icons.icons['add-line'].body;
});
</script>

<template>
  <svg
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    class="m-auto"
    width="1.2em"
    height="1.2em"
    v-html="icon"
  />
</template>
https://github.com/antfu/unplugin-icons/issues/5
-->
