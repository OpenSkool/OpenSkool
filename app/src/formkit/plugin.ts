import { nl } from '@formkit/i18n';
import { plugin, defaultConfig, createInput } from '@formkit/vue';
import type { App } from 'vue';

import { createButtonStyles } from '~/components/button/helpers';
import FkSelect from '~/components/select/fk-select.vue';

import { generateClasses } from './helpers';

const BOX = {
  fieldset: 'max-w-md border border-gray-400 rounded-md px-4 pb-2',
  legend: 'font-bold text-base p-2',
  wrapper: 'flex items-center mb-1 cursor-pointer',
  help: 'mb-2',
  input: `
    form-check-input appearance-none
    h-5 w-5 mr-2
    border border-gray-500 rounded-sm bg-white checked:bg-primary-400
    focus:outline-none focus-visible:(ring-3 ring-offset-2 ring-primary-300)
    transition duration-200
  `,
  label: 'text-base text-gray-700 mt-1',
};

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
          radio: {
            ...BOX,
            input: BOX.input.replace('rounded-sm', 'rounded-full'),
          },
          text: TEXT,
        }),
      },
      inputs: {
        UiSelect: createInput(FkSelect, {
          props: ['options'],
        }),
      },
      locales: { nl },
    }),
  );
}
