<script lang="ts" setup>
defineProps<{
	ariaExpanded: boolean;
}>();
</script>

<template>
	<button
		:aria-expanded="ariaExpanded"
		aria-haspopup="menu"
		class="rounded-md flex py-2 px-3 text-dark-700 gap-3 items-center focus:outline-none focus-visible:(ring-2 ring-dark-700)"
	>
		<RiMenuFoldLine v-if="ariaExpanded" aria-hidden />
		<RiMenuLine v-else aria-hidden />
		{{ $t('global.mainMenu.toggleButton') }}
	</button>
</template>
