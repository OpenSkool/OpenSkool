<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router';

import { createButtonStyles } from './helpers';

const props = defineProps<{
	color?: 'primary' | 'danger';
	outline?: boolean;
	size?: 'sm' | 'base';
	to: RouterLinkProps['to'];
}>();

const buttonStyles = computed(() => createButtonStyles(props));
</script>

<template>
	<RouterLink :class="buttonStyles" :to="to">
		<slot />
	</RouterLink>
</template>
