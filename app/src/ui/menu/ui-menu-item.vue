<script lang="ts" setup>
import type { AnyComponent } from '~/types';

defineProps<{
	is?: string | AnyComponent;
}>();
</script>

<template>
	<MenuItem v-slot="{ active, disabled }">
		<Component
			:is="is ?? 'button'"
			class="rounded-md flex w-full py-3 px-4 gap-3 items-center"
			:class="{ 'bg-primary-100': active }"
		>
			<slot v-bind="{ active, disabled }" />
		</Component>
	</MenuItem>
</template>
