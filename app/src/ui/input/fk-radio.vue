<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

defineProps<{
	context: FormKitFrameworkContext;
}>();
</script>

<template>
	<UiRadioGroup
		:id="context.id"
		class="my-1"
		:options="context.options"
		:model-value="context._value"
		:name="context.id"
		v-bind="context.attrs"
		@update:model-value="context.node.input"
	/>
</template>
