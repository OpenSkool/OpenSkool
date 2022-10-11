<script lang="ts" setup>
defineProps<{
	label: string;
}>();
</script>

<template>
	<button
		:aria-label="label"
		class="rounded-lg p-2 text-primary-600 inline-flex items-center select-none hover:bg-primary-200 focus:outline-none"
		focus-visible:ring="2 offset-2 primary-500"
	>
		<slot />
	</button>
</template>
