<script lang="ts" setup>
import OverviewCurriculum from './overview-curriculum.vue';
import OverviewPosition from './overview-position.vue';

defineProps<{
	instanceId: string;
}>();
</script>

<template>
	<div class="grid gap-10">
		<OverviewCurriculum :instance-id="instanceId" />
		<OverviewPosition :instance-id="instanceId" />
	</div>
</template>

<style scoped>
.grid {
	grid-template-columns: repeat(auto-fill, minmax(30ch, 1fr));
}
</style>
