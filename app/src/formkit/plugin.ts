import { nl } from '@formkit/i18n';
import { plugin, defaultConfig, createInput } from '@formkit/vue';
import type { App } from 'vue';

import Listbox from '~/components/listbox/fk-listbox.vue';

import { generateClasses } from './helpers';

const BOX = {
  fieldset: 'max-w-md border border-gray-400 rounded-md px-4 pb-2',
  legend: 'font-bold text-sm p-2',
  wrapper: 'flex items-center mb-1 cursor-pointer',
  help: 'mb-2',
  input:
    'form-check-input appearance-none h-5 w-5 mr-2 border border-gray-500 rounded-sm bg-white checked:bg-primary1-500 focus:outline-none focus:ring-0 transition duration-200',
  label: 'text-sm text-gray-700 mt-1',
};

const BUTTON = {
  input: 'btn btn-primary',
  wrapper: 'mb-1',
};

const TEXT = {
  inner: `
    max-w-md
    border border-gray-400
    bg-light-100
    rounded-lg
    mb-1
    overflow-hidden
    focus-within:border-primary1-500
    formkit-invalid:border-red-500
  `,
  input:
    'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
};

export function formkit(app: App): void {
  app.use(
    plugin,
    defaultConfig({
      config: {
        classes: generateClasses({
          global: {
            help: 'text-xs text-gray-500',
            label: 'block mb-1 font-bold text-sm formkit-invalid:text-red-500',
            messages: 'list-none p-0 mt-1 mb-0',
            message: 'text-red-500 mb-1 text-xs',
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
        listbox: createInput(Listbox, {
          props: ['options'],
        }),
      },
      locales: { nl },
    }),
  );
}
