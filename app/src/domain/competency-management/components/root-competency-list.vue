<script lang="ts" setup>
import { graphql } from '~/codegen';
import { NotFoundCard, useGlobalStore } from '~/domain/global';

import CompetencyList from './competency-list.vue';

const props = defineProps<{
	frameworkId: string;
	showReorderControls?: boolean;
}>();

const ability = useAppAbility();
const globalStore = useGlobalStore();

const ManageRootCompetenciesDocument = graphql(`
	query manageRootCompetencies($id: ID!) {
		competencyFramework(id: $id) {
			... on QueryCompetencyFrameworkSuccess {
				data {
					competencies {
						id
						title
					}
				}
			}
			...UserErrorFragment
		}
	}
`);

const { loading, onError, refetch, result } = useQuery(
	ManageRootCompetenciesDocument,
	() => ({ id: props.frameworkId }),
	{ fetchPolicy: 'network-only' },
);
onError(globalStore.handleFatalApolloError);

const framework = computed(() =>
	result.value?.competencyFramework?.__typename ===
	'QueryCompetencyFrameworkSuccess'
		? result.value.competencyFramework.data
		: null,
);
</script>

<template>
	<template v-if="framework != null || !loading">
		<NotFoundCard v-if="framework == null">
			{{ $t('management.competency.error.notFound') }}
		</NotFoundCard>
		<UiEmptyCard v-else-if="framework.competencies.length === 0">
			<p v-t="'management.competency.list.emptyRootDescription'" />
			<UiButtonRouterLink
				v-if="ability.can('create', 'Competency')"
				class="my-5"
				:to="`${$route.path}/create-competency`"
			>
				{{ $t('management.competency.action.create') }}
			</UiButtonRouterLink>
		</UiEmptyCard>
		<CompetencyList
			v-else
			:competencies="framework.competencies"
			:framework-id="frameworkId"
			:show-reorder-controls="showReorderControls"
			@swap="refetch()"
		/>
	</template>
</template>
