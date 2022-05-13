import { nl } from '@formkit/i18n';
import { plugin, defaultConfig, createInput } from '@formkit/vue';
import type { App } from 'vue';

import { createButtonStyles } from '~/components/button/helpers';
import FkCheckbox from '~/components/input/fk-checkbox.vue';
import FkInputText from '~/components/input/fk-input-text.vue';
import FkRadio from '~/components/input/fk-radio.vue';
import FkSelect from '~/components/select/fk-select.vue';

import { generateClasses } from './helpers';

const BUTTON = {
  input: createButtonStyles({ color: 'primary' }),
  wrapper: 'mb-1',
};

const TEXT = {
  inner: `
    max-w-md
    border border-gray-400
    bg-gray-100
    rounded-lg
    mb-1
    overflow-hidden
    focus-within:(ring-3 ring-offset-2 ring-primary-300)
    formkit-invalid:border-red-500
  `,
  input: `
    w-full h-10 px-3
    border-none
    text-base text-gray-700 placeholder-gray-400
  `,
};

export function formkit(app: App): void {
  app.use(
    plugin,
    defaultConfig({
      config: {
        classes: generateClasses({
          global: {
            help: 'text-sm text-gray-600',
            label:
              'block mb-1 font-bold text-sm formkit-invalid:text-danger-400',
            messages: 'list-none p-0 mt-1 mb-0',
            message: 'text-danger-300 mb-1 text-sm',
            outer: 'mb-5 opacity-100 formkit-disabled:opacity-40',
          },
          button: BUTTON,
          submit: BUTTON,
          text: TEXT,
        }),
      },
      inputs: {
        checkbox: createInput(FkCheckbox),
        radio: createInput(FkRadio),
        UiSelect: createInput(FkSelect, {
          props: ['options'],
        }),
        UiInputText: createInput(FkInputText),
      },
      locales: { nl },
    }),
  );
}
