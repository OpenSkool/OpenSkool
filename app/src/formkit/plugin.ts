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
        }),
      },
      inputs: {
        checkbox: createInput(FkCheckbox),
        radio: createInput(FkRadio),
        select: createInput(FkSelect, { props: ['options'] }),
        text: createInput(FkInputText),
      },
      locales: { nl },
    }),
  );
}
