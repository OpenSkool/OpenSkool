<script lang="ts" setup>
import { graphql } from '~/codegen';
import { NotFoundCard, useGlobalStore } from '~/domain/global';

import CompetencyList from './competency-list.vue';

const props = defineProps<{
	competencyId: string;
	frameworkId: string;
	showReorderControls?: boolean;
}>();

const ability = useAppAbility();
const globalStore = useGlobalStore();

const ManageNestedCompetenciesDocument = graphql(`
	query manageNestedCompetencies($id: ID!) {
		competency(id: $id) {
			... on QueryCompetencySuccess {
				data {
					subCompetencies {
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
	ManageNestedCompetenciesDocument,
	() => ({ id: props.competencyId }),
	{ fetchPolicy: 'network-only' },
);
onError(globalStore.handleFatalApolloError);

const competency = computed(() =>
	result.value?.competency?.__typename === 'QueryCompetencySuccess'
		? result.value.competency.data
		: null,
);
const subCompetencies = computed(() => competency.value?.subCompetencies ?? []);
</script>

<template>
	<template v-if="!loading">
		<NotFoundCard v-if="competency == null">
			{{ $t('management.competency.error.notFound') }}
		</NotFoundCard>
		<UiEmptyCard v-else-if="subCompetencies.length === 0">
			<p v-t="'management.competency.list.emptyNestedDescription'" />
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
			:competencies="subCompetencies"
			:framework-id="frameworkId"
			:show-reorder-controls="showReorderControls"
			@swap="refetch()"
		/>
	</template>
</template>
