<script lang="ts" setup>
withDefaults(
	defineProps<{
		disabled?: boolean;
		is?: 'input' | 'textarea';
		modelValue?: string;
	}>(),
	{ is: 'input', modelValue: undefined },
);

defineEmits<(event: 'update:modelValue', value: string) => void>();
</script>

<template>
	<UiInput
		:is="is"
		type="text"
		:disabled="disabled"
		:value="modelValue"
		@input="
			$emit('update:modelValue', ($event.target as HTMLInputElement).value)
		"
	/>
</template>
