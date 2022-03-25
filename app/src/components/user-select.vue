<script lang="ts" setup>
import { useDemoStore } from '~/demo-store';
import { GetPeopleQuery } from '~/generated/graphql';

const { result } = useQuery<GetPeopleQuery>(gql`
  query getPeople {
    allPeople {
      id
      firstName
      lastName
    }
  }
`);

const people = useResult(result, [], (data) => data.allPeople);

const demoStore = useDemoStore();
const selectedPersonId = ref<string>();
watchEffect(() => {
  demoStore.setActiveUserId(selectedPersonId.value);
});

const selectedPerson = computed(() =>
  people.value.find((item) => item.id === selectedPersonId.value),
);
</script>
<template>
  <ui-listbox
    v-model="selectedPersonId"
    :selected-label="
      selectedPerson == null
        ? 'Kies een gebruiker'
        : selectedPerson?.firstName + ' ' + selectedPerson?.lastName
    "
  >
    <ui-listbox-option
      v-for="person in people"
      :key="person.id"
      :value="person.id"
    >
      {{ person.firstName + ' ' + person.lastName }}
    </ui-listbox-option>
  </ui-listbox>
</template>
