<script lang="ts" setup>
import { graphql } from '~/codegen';
import { RootCompetencyList } from '~/domain/competency-management';
import { AuthAccessDeniedLayout, NotFoundLayout } from '~/domain/global';
import {
	ManagementLayout,
	ManagementLayoutItem,
	ManagementLayoutLink,
} from '~/domain/management';
import { useHead } from '~/i18n';

import RiAddLine from '~icons/ri/add-line';
import RiArrowUpDownLine from '~icons/ri/arrow-up-down-line';

const route = useRoute();
const frameworkId = computed((): string => route.params.frameworkId as string);

const ability = useAppAbility();

const ManageCompetencyFrameworkDetailRouteDocument = graphql(`
	query manageCompetencyFrameworkDetailRoute($id: ID!) {
		competencyFramework(id: $id) {
			... on QueryCompetencyFrameworkSuccess {
				data {
					id
					title
				}
			}
			...UserErrorFragment
		}
	}
`);

const { loading, result } = useQuery(
	ManageCompetencyFrameworkDetailRouteDocument,
	() => ({ id: frameworkId.value }),
	{ fetchPolicy: 'network-only' },
);
const competencyFramework = computed(() =>
	result.value?.competencyFramework?.__typename ===
	'QueryCompetencyFrameworkSuccess'
		? result.value.competencyFramework.data
		: null,
);

useHead(() => ({
	title: competencyFramework.value?.title,
}));

const showReorderCompetenciesControls = ref(false);
</script>

<template>
	<UiBreadcrumb>
		<UiBreadcrumbItem link-to="/manage/competencies">
			{{ $t('management.competencyFramework.list.heading') }}
		</UiBreadcrumbItem>
	</UiBreadcrumb>
	<AuthAccessDeniedLayout
		v-if="ability.cannot('read', 'CompetencyFramework')"
	/>
	<template v-else-if="!loading">
		<NotFoundLayout v-if="competencyFramework == null">
			<p v-t="'management.competencyFramework.error.notFound'" />
		</NotFoundLayout>
		<template v-else>
			<UiTitle is="h1" class="text-xl mb-3">
				{{ competencyFramework.title }}
			</UiTitle>
			<ManagementLayout>
				<template #actions>
					<ManagementLayoutLink
						v-if="ability.can('create', 'Competency')"
						:icon="RiAddLine"
						:to="`/manage/competencies/${frameworkId}/create-competency`"
					>
						{{ $t('management.competency.action.create') }}
					</ManagementLayoutLink>
					<ManagementLayoutItem
						is="button"
						v-if="ability.can('update', 'Competency')"
						:icon="RiArrowUpDownLine"
						@click="
							showReorderCompetenciesControls = !showReorderCompetenciesControls
						"
					>
						{{ $t('management.competency.list.action.reorder') }}
					</ManagementLayoutItem>
				</template>
				<RootCompetencyList
					:framework-id="frameworkId"
					:show-reorder-controls="showReorderCompetenciesControls"
				/>
			</ManagementLayout>
		</template>
	</template>
</template>
