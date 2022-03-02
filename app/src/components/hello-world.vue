<script lang="ts" setup>
import { GetEducationsQuery } from '~/generated/graphql';

defineProps<{ msg: string }>();

const { result } = useQuery<GetEducationsQuery>(gql`
  query getEducations {
    allEducations {
      id
      title
    }
  }
`);

const educations = useResult(result, null, (data) => data.allEducations);

const dialogIsOpen = ref(false);
const alertDialogIsOpen = ref(false);
</script>

<template>
  <div class="flex items-center justify-center gap-2 m-16">
    <ri-home-4-line class="text-pink-500" />
    <h1>{{ msg }}</h1>
  </div>
  <ul class="my-3">
    <li v-for="education of educations" :key="education.id">
      {{ education.title }}
    </li>
  </ul>
  <button
    class="bg-lime-400 hover:bg-lime-200 px-4 py-3 rounded border border-lime-800"
    @click="dialogIsOpen = true"
  >
    Dialog
  </button>
  <ui-dialog :is-open="dialogIsOpen" @dismiss="dialogIsOpen = false">
    <p class="mb-5">
      Aliquip est aliqua aute exercitation. Culpa do irure voluptate. Non ea
      veniam mollit labore amet labore ea velit dolore. Elit mollit laboris ea
      sunt aliqua mollit veniam et enim occaecat ex in ullamco nulla. Est
      voluptate cupidatat pariatur officia tempor dolore excepteur duis
      incididunt aliqua incididunt. Ut veniam sint ex eu ullamco. Deserunt
      nostrud qui in laboris eiusmod sint elit tempor. Cillum tempor nostrud
      veniam nisi. Sint irure ullamco non culpa anim sint eu consectetur veniam
      in elit laboris est do. Consequat voluptate non adipisicing ipsum quis
      magna aliqua.
    </p>
    <button
      class="bg-lime-400 hover:bg-lime-200 px-4 py-1 rounded border border-lime-800"
      @click="dialogIsOpen = false"
    >
      Ok
    </button>
  </ui-dialog>
  <button
    class="bg-lime-400 hover:bg-lime-200 px-4 py-3 rounded border border-lime-800"
    @click="alertDialogIsOpen = true"
  >
    Alert Dialog
  </button>
  <ui-alert-dialog
    id="alert-dialog"
    :is-open="alertDialogIsOpen"
    @dismiss="alertDialogIsOpen = false"
  >
    <template #label>Are you sure?</template>
    <template #description>
      <p>
        Aliquip est aliqua aute exercitation. Culpa do irure voluptate. Non ea
        veniam mollit labore amet labore ea velit dolore. Elit mollit laboris ea
        sunt aliqua mollit veniam et enim occaecat ex in ullamco nulla. Est
        voluptate cupidatat pariatur officia tempor dolore excepteur duis
        incididunt aliqua incididunt. Ut veniam sint ex eu ullamco. Deserunt
        nostrud qui in laboris eiusmod sint elit tempor. Cillum tempor nostrud
        veniam nisi. Sint irure ullamco non culpa anim sint eu consectetur
        veniam in elit laboris est do. Consequat voluptate non adipisicing ipsum
        quis magna aliqua.
      </p>
    </template>
    <template #buttons>
      <button
        class="bg-lime-400 hover:bg-lime-200 px-4 py-1 rounded border border-lime-800"
        @click="alertDialogIsOpen = false"
      >
        Confirm
      </button>
      <button
        class="bg-gray-400 hover:bg-gray-200 px-4 py-1 rounded border border-gray-800"
        @click="alertDialogIsOpen = false"
      >
        Cancel
      </button>
    </template>
  </ui-alert-dialog>
</template>
