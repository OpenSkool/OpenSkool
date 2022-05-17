<script lang="ts" setup>
import { AVAILABLE_LOCALES, i18nService } from '~/i18n';
import { assert } from '~/utils';

function getLanguageName(locale: string): string {
  const languageNames = new Intl.DisplayNames(locale, {
    type: 'language',
  });
  const displayName = languageNames.of(locale);
  assert(displayName);
  return displayName;
}

const { locale } = useI18n();
const selectedLocale = ref(locale);
watch(selectedLocale, () => {
  i18nService.setLocale(selectedLocale.value);
});
</script>

<template>
  <div class="flex gap-3 items-center">
    <RiGlobalFill />
    <UiSelect
      v-model="selectedLocale"
      :selected-label="getLanguageName(selectedLocale)"
    >
      <UiSelectOption
        v-for="availableLocale of AVAILABLE_LOCALES"
        :key="availableLocale"
        :value="availableLocale"
      >
        {{ getLanguageName(availableLocale) }}
      </UiSelectOption>
    </UiSelect>
  </div>
</template>
