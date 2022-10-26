<script lang="ts" setup>
withDefaults(
	defineProps<{
		is?: 'div' | 'input' | 'textarea';
	}>(),
	{
		is: 'div',
	},
);
</script>

<template>
	<Component
		:is="is"
		class="bg-white rounded-md border-1 border-gray-200 shadow-md py-2 px-3 root inline-block focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700)"
	>
		<slot />
	</Component>
</template>

<style scoped>
.root:disabled {
	@apply cursor-not-allowed bg-stone-300 border-stone-400 border-opacity-50 text-stone-400;
}
.root {
	width: min(100%, 60ch);
}
</style>
