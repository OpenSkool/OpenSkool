<script lang="ts" setup>
defineProps<{
	disabled?: boolean;
}>();
</script>

<template>
	<label
		class="flex gap-2 items-center"
		:class="{ 'text-stone-300': disabled }"
	>
		<div class="h-5 w-5 relative" :class="{ 'cursor-not-allowed': disabled }">
			<input
				class="bg-white rounded-sm h-5 w-5 center pointer-events-none focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700) checked:bg-primary-400 disabled:bg-stone-300"
				:disabled="disabled"
				type="checkbox"
				v-bind="$attrs"
			/>
			<RiCheckLine class="text-white hidden center check" />
		</div>
		<slot />
	</label>
</template>

<style scoped>
input:checked + .check {
	display: block;
}
.center {
	@apply transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute;
}
</style>
