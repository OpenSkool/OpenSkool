<script lang="ts" setup>
import { ManageCompetencyCreateNestedCompetencyRouteDocument } from '~/codegen/graphql';
import { NestedCompetencyCreate } from '~/domain/competency-management';
import { AuthAccessDeniedLayout } from '~/domain/global';
import { useHead } from '~/i18n';

const route = useRoute();
const competencyId = computed(
	(): string => route.params.competencyId as string,
);
const frameworkId = computed((): string => route.params.frameworkId as string);

const ability = useAppAbility();

useHead(({ t }) => ({
	title: t('management.competency.create.heading'),
}));

gql`
	query manageCompetencyCreateNestedCompetencyRoute(
		$competencyId: ID!
		$frameworkId: ID!
	) {
		competency(id: $competencyId) {
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
		competencyFramework(id: $frameworkId) {
			... on QueryCompetencyFrameworkSuccess {
				data {
					title
				}
			}
			...BaseErrorFields
		}
	}
`;

const { result } = useQuery(
	ManageCompetencyCreateNestedCompetencyRouteDocument,
	() => ({
		competencyId: competencyId.value,
		frameworkId: frameworkId.value,
	}),
	{ fetchPolicy: 'network-only' },
);

const framework = computed(() =>
	result.value?.competencyFramework?.__typename ===
	'QueryCompetencyFrameworkSuccess'
		? result.value.competencyFramework.data
		: null,
);
const parent = computed(() =>
	result.value?.competency?.__typename === 'QueryCompetencySuccess'
		? result.value.competency.data
		: null,
);
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
			v-if="parent"
			:link-to="`/manage/competencies/${frameworkId}/${competencyId}`"
		>
			{{ parent.title }}
		</UiBreadcrumbItem>
	</UiBreadcrumb>
	<AuthAccessDeniedLayout v-if="ability.cannot('create', 'Competency')" />
	<template v-else>
		<UiTitle is="h1" class="text-xl mb-3">
			{{ $t('management.competency.create.heading') }}
		</UiTitle>
		<NestedCompetencyCreate
			:competency-id="competencyId"
			:framework-id="frameworkId"
		/>
	</template>
</template>
