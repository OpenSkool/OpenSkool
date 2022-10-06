<script lang="ts" setup>
import { graphql } from '~/codegen';
import { useGlobalStore } from '~/domain/global/store.js';

const props = defineProps<{
	instanceId: string; // route param
}>();

const globalStore = useGlobalStore();

const InternshipOverviewPositionQueryDocument = graphql(`
	query InternshipOverviewPositionQuery($id: ID!) {
		internshipInstance(id: $id) {
			id
			assignedPosition {
				organisation {
					imageUrl
					name
				}
				summary
			}
		}
	}
`);

const { onError, result } = useQuery(
	InternshipOverviewPositionQueryDocument,
	() => ({
		id: props.instanceId,
	}),
	{ fetchPolicy: 'cache-first' },
);
onError(globalStore.handleFatalApolloError);

const position = computed(
	() => result.value?.internshipInstance?.assignedPosition,
);
</script>

<template>
	<UiCard v-if="position" class="py-3 px-5">
		<div class="space-y-3">
			<UiTitle is="h3" class="text-lg">
				{{ position.organisation?.name ?? 'Position' }}
			</UiTitle>
			<div class="-mx-5">
				<img
					v-if="position.organisation"
					class="bg-light-500"
					:src="position.organisation.imageUrl"
				/>
			</div>
			<p class="max-w-65ch">{{ position.summary }}</p>
		</div>
	</UiCard>
</template>
