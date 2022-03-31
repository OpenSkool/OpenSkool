<script lang="ts" setup>
import { useDemoStore } from '~/demo-store';
import { GetPeopleQuery } from '~/generated/graphql';

const { result } = useQuery<GetPeopleQuery>(gql`
  query getPeople {
    allPeople {
      id
      displayName
    }
  }
`);
const people = useResult(result, []);

const demoStore = useDemoStore();
const selectedPerson = computed(() =>
  demoStore.demoUserId == null
    ? undefined
    : people.value.find((person) => person.id === demoStore.demoUserId),
);
</script>
<template>
  <div class="flex gap-3 items-center">
    <ri-shield-user-fill />
    <ui-listbox
      :model-value="demoStore.demoUserId"
      :selected-label="selectedPerson?.displayName"
      @update:model-value="demoStore.setDemoUserId($event as string)"
    >
      <ui-listbox-option
        v-for="person in people"
        :key="person.id"
        :value="person.id"
      >
        {{ person.displayName }}
      </ui-listbox-option>
    </ui-listbox>
  </div>
</template>
