<script lang="ts" setup>
import { AVAILABLE_LOCALES, useI18nStore } from '~/i18n';
import { assert } from '~/utils';

function getLanguageName(locale: string): string {
  const languageNames = new Intl.DisplayNames(locale, {
    type: 'language',
  });
  const displayName = languageNames.of(locale);
  assert(displayName);
  return displayName;
}

const i18nStore = useI18nStore();
const selectedLocale = ref(i18nStore.locale);
watch(selectedLocale, () => {
  i18nStore.setLocale(selectedLocale.value);
});
</script>

<template>
  <div class="flex gap-3 items-center">
    <RiGlobalFill />
    <UiListbox
      v-model="selectedLocale"
      :selected-label="getLanguageName(selectedLocale)"
    >
      <UiListboxOption
        v-for="locale of AVAILABLE_LOCALES"
        :key="locale"
        :value="locale"
      >
        {{ getLanguageName(locale) }}
      </UiListboxOption>
    </UiListbox>
  </div>
</template>
