<script lang="ts" setup>
import { useDemoStore } from '~/demo-store';
import { GetPeopleQuery } from '~/generated/graphql';
import { sample } from '~/utils';

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
const selectedPersonId = ref<string>();
watchEffect(() => {
  demoStore.setDemoUserId(selectedPersonId.value);
});
watchEffect(() => {
  if (people.value.length > 0 && selectedPersonId.value == null) {
    selectedPersonId.value = sample(people.value).id;
  }
});

const selectedPerson = computed(() =>
  people.value.find((item) => item.id === selectedPersonId.value),
);
</script>
<template>
  <div class="flex gap-3 items-center">
    <ri-shield-user-fill />
    <ui-listbox
      v-model="selectedPersonId"
      :selected-label="
        selectedPerson == null
          ? 'Kies een gebruiker'
          : selectedPerson.displayName
      "
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
