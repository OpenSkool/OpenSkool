<script lang="ts" setup>
import { DialogOverlay } from '@headlessui/vue';

defineProps<{
	implicitClose?: boolean;
	open: boolean;
}>();

defineEmits<(event: 'close') => void>();
</script>

<template>
	<TransitionRoot appear :show="open" as="template">
		<Dialog as="template" @close="$emit('close')">
			<div class="inset-0 fixed">
				<TransitionChild
					enter="duration-300 ease-out"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<Component
						:is="implicitClose ? DialogOverlay : 'div'"
						aria-hidden
						class="bg-black opacity-30 inset-0 fixed"
					/>
				</TransitionChild>
				<TransitionChild
					enter="duration-300 ease-out transform"
					enter-from="opacity-0 scale-75 translate-y-2em"
					enter-to="opacity-100 scale-100 translate-y-0"
					leave="duration-100 ease-in transform"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-50"
				>
					<div
						class="bg-white mx-auto max-w-lg rounded-2xl shadow-xl my-8 p-6 z-10 relative"
						v-bind="$attrs"
					>
						<div v-if="implicitClose" class="p-3 top-0 right-0 absolute">
							<button
								class="rounded-lg flex p-2 text-dark-700 focus:outline-none focus-visible:(ring-2 ring-dark-700)"
								type="button"
								@click="$emit('close')"
							>
								<RiCloseLine />
							</button>
						</div>
						<div class="space-y-8">
							<slot />
						</div>
					</div>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
