<script lang="ts" setup>
import { MyInternshipRouteQueryDocument } from '~/codegen/graphql';
import { NotFoundLayout, useGlobalStore } from '~/domain/global';
import {
	InternshipOverview,
	InternshipPositionList,
} from '~/domain/internships';
import { useHead } from '~/i18n';

const route = useRoute();
const instanceId = computed((): string => route.params.instanceId as string);

const ability = useAppAbility();
const globalStore = useGlobalStore();

gql`
	query MyInternshipRouteQuery($id: ID!) {
		internshipInstance(id: $id) {
			id
			internship {
				id
				course {
					name
				}
			}
			isPositionAssigned
		}
	}
`;

const { loading, onError, result } = useQuery(
	MyInternshipRouteQueryDocument,
	() => ({
		id: instanceId.value,
	}),
	{
		enabled: ability.can('read', 'InternshipInstance'),
		fetchPolicy: 'cache-first',
	},
);
onError(globalStore.handleFatalApolloError);

const internshipInstance = computed(() => result.value?.internshipInstance);

useHead(({ t }) => ({
	title: t('internships.internshipInstance.detail.heading', {
		courseName: internshipInstance.value?.internship.course.name,
	}),
}));
</script>

<template>
	<UiBreadcrumb>
		<UiBreadcrumbItem>
			{{ $t('global.mainMenu.internshipsHeading') }}
		</UiBreadcrumbItem>
	</UiBreadcrumb>
	<template v-if="!loading">
		<NotFoundLayout v-if="internshipInstance == null">
			<p v-t="'internships.internshipInstance.error.notFound'" />
		</NotFoundLayout>
		<template v-else>
			<div class="flex flex-wrap mb-8 gap-16 justify-between">
				<UiTitle is="h1" class="text-xl">
					{{
						$t('internships.internshipInstance.detail.heading', {
							courseName: internshipInstance.internship.course.name,
						})
					}}
				</UiTitle>
				<UiStepsGroup
					:steps="[
						{ label: 'Application', name: 'application' },
						{ label: 'Assignment', name: 'assignment' },
						{ label: 'Execution', name: 'execution' },
						{ label: 'Evaluation', name: 'evaluation' },
					]"
					:current-step="
						internshipInstance.isPositionAssigned ? 'assignment' : 'application'
					"
					label="The progress of your internship"
				/>
			</div>
			<InternshipOverview
				v-if="internshipInstance.isPositionAssigned"
				:instance-id="instanceId"
			/>
			<InternshipPositionList v-else :instance-id="instanceId" />
		</template>
	</template>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(auto-fill, minmax(30ch, 1fr));
}
img {
	aspect-ratio: 16 / 9;
}
</style>
