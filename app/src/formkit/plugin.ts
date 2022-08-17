import { nl } from '@formkit/i18n';
import { generateClasses } from '@formkit/themes';
import { plugin, defaultConfig, createInput } from '@formkit/vue';
import type { App } from 'vue';

import { createButtonStyles } from '~/ui/button/helpers';
import FkCheckbox from '~/ui/input/fk-checkbox.vue';
import FkInputText from '~/ui/input/fk-input-text.vue';
import FkRadio from '~/ui/input/fk-radio.vue';
import FkTextarea from '~/ui/input/fk-textarea.vue';
import FkSelect from '~/ui/select/fk-select.vue';

const BUTTON = {
  input: createButtonStyles(),
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
              'block mb-1 font-bold text-sm formkit-invalid:text-danger-500',
            messages: 'list-none p-0 mt-1 mb-0',
            message: 'text-danger-500 mb-1 text-sm',
            outer: 'mb-5 opacity-100 formkit-disabled:opacity-40',
          },
          button: BUTTON,
          submit: BUTTON,
        }),
      },
      inputs: {
        checkbox: createInput(FkCheckbox),
        email: createInput(FkInputText),
        radio: createInput(FkRadio),
        select: createInput(FkSelect, { props: ['options'] }),
        text: createInput(FkInputText),
        textarea: createInput(FkTextarea),
      },
      locales: { nl },
    }),
  );
}
