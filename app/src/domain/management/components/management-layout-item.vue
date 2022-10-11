<script lang="ts" setup>
import type { FunctionalComponent, SVGAttributes } from 'vue';

defineProps<{
	icon: FunctionalComponent<SVGAttributes>;
	is: 'button' | Record<string, unknown>; // Can't find how to type RouterLink here properly
}>();
</script>

<template>
	<Component :is="is">
		<div class="osml-item__icon">
			<Component :is="icon" aria-hidden />
		</div>
		<div class="osml-item__label">
			<slot />
		</div>
	</Component>
</template>
