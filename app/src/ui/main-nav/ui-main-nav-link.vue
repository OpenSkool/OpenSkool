<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router';

defineProps<{
	to: RouterLinkProps['to'];
}>();
</script>

<template>
	<RouterLink
		active-class="font-medium bg-primary-200/50"
		class="rounded-md py-2 px-3 block hover:bg-gray-200 focus:outline-none focus-visible:(ring-2 ring-primary-700)"
		:to="to"
	>
		<slot />
	</RouterLink>
</template>
