<template>
	<Menu v-slot="{ open }" as="div" class="relative inline-block">
		<slot v-bind="{ open }" />
	</Menu>
</template>
