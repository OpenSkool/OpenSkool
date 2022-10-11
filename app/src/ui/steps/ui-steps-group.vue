<script lang="ts" setup>
interface Step {
	done?: boolean;
	label: string;
	name: string;
}

const props = defineProps<{
	steps: Step[];
	currentStep?: string | 'done';
	label: string;
}>();

const steps = computed(() => {
	let done = props.currentStep != null;
	return props.steps.map((step) => {
		done = done && step.name !== props.currentStep;
		return { ...step, done };
	});
});
</script>

<template>
	<ol role="list" :aria-label="label">
		<li
			v-for="step of steps"
			:key="step.name"
			:aria-current="step.name === currentStep ? 'step' : undefined"
			:data-done="step.done"
		>
			{{ step.label }}
			<div class="step-indicator">
				<RiCheckLine v-if="step.done" class="text-white" />
				<div v-if="step.done" class="visually-hidden">Done</div>
			</div>
		</li>
	</ol>
</template>

<style scoped>
ol {
	--indicator-size: 2em;
	--line-size: 0.2em;
	--padding-inline: 1.5em;

	@apply hidden md:flex;
	margin-inline: calc(-1 * var(--padding-inline));
}
li {
	position: relative;
	flex: 1 0 auto;
	margin-top: var(--indicator-size);
	padding-inline: var(--padding-inline);
	line-height: 2;
}

li .step-indicator {
	position: absolute;
	z-index: 1;
	top: calc(-1 * var(--indicator-size));
	left: calc(50% - var(--indicator-size) / 2);
	width: var(--indicator-size);
	height: var(--indicator-size);
	border-radius: 100%;
	border-width: var(--line-size);
	display: flex;
	align-items: center;
	justify-content: center;
	@apply border-gray-300;
}
li[data-done='true'] .step-indicator {
	@apply bg-primary-500 border-primary-500;
}
li[aria-current] .step-indicator {
	@apply bg-primary-200 border-primary-500;
}

/* Lines */
li:after,
li:before {
	content: '';
	position: absolute;
	height: var(--line-size);
	top: calc(-1 * (var(--indicator-size) + var(--line-size)) / 2);
	@apply bg-gray-300;
}

/* Line after */
li:after {
	left: calc(50% + (var(--indicator-size) - var(--line-size)) / 2);
	right: 0;
}
li[data-done='true']:after {
	@apply bg-primary-500;
}
li:last-child:after {
	display: none;
}

/* Line before */
li:before {
	right: calc(50% + (var(--indicator-size) - var(--line-size)) / 2);
	left: 0;
}
li[data-done='true'] + li:before {
	@apply bg-primary-500;
}
li:first-child:before {
	display: none;
}
</style>
