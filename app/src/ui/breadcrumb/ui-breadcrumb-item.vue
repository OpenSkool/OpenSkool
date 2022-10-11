<script lang="ts" setup>
defineProps<{
	linkTo?: string;
}>();
</script>

<template>
	<li class="inline text-sm text-gray-600 uppercase">
		<RouterLink
			v-if="linkTo"
			class="-m-1 p-1 hover:underline rounded-sm focus:outline-none focus-visible:(ring-2 ring-dark-700)"
			:to="linkTo"
		>
			<slot />
		</RouterLink>
		<template v-else>
			<slot />
		</template>
	</li>
</template>

<style scoped>
li + li::before {
	@apply mx-5 text-gray-400;
	content: '/';
}
</style>
