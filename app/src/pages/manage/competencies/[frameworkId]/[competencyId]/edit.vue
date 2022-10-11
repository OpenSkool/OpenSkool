<script lang="ts" setup>
import { ManageCompetencyEditCompetencyRouteDocument } from '~/codegen/graphql';
import { CompetencyEdit } from '~/domain/competency-management';
import { AuthAccessDeniedLayout } from '~/domain/global';
import { useHead } from '~/i18n';

const route = useRoute();
const competencyId = computed(
	(): string => route.params.competencyId as string,
);
const frameworkId = computed((): string => route.params.frameworkId as string);

const ability = useAppAbility();

useHead(({ t }) => ({
	title: t('management.competency.edit.heading'),
}));

gql`
	query manageCompetencyEditCompetencyRoute($id: ID!) {
		competency(id: $id) {
			... on QueryCompetencySuccess {
				data {
					title
					framework {
						title
					}
				}
			}
			...BaseErrorFields
		}
	}
`;

const { result } = useQuery(
	ManageCompetencyEditCompetencyRouteDocument,
	() => ({ id: competencyId.value }),
	{ fetchPolicy: 'network-only' },
);

const competency = computed(() =>
	result.value?.competency?.__typename === 'QueryCompetencySuccess'
		? result.value.competency.data
		: null,
);
const framework = computed(() => competency.value?.framework);
</script>

<template>
	<UiBreadcrumb>
		<UiBreadcrumbItem link-to="/manage/competencies">
			{{ $t('management.competencyFramework.list.heading') }}
		</UiBreadcrumbItem>
		<UiBreadcrumbItem
			v-if="framework"
			:link-to="`/manage/competencies/${frameworkId}`"
		>
			{{ framework.title }}
		</UiBreadcrumbItem>
		<UiBreadcrumbItem
			v-if="competency"
			:link-to="`/manage/competencies/${frameworkId}/${competencyId}`"
		>
			{{ competency.title }}
		</UiBreadcrumbItem>
	</UiBreadcrumb>
	<AuthAccessDeniedLayout v-if="ability.cannot('update', 'Competency')" />
	<template v-else>
		<UiTitle is="h1" class="text-xl mb-3">
			{{ $t('management.competency.edit.heading') }}
		</UiTitle>
		<CompetencyEdit :competency-id="competencyId" :framework-id="frameworkId" />
	</template>
</template>
