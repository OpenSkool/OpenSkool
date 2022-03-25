import type { FormKitNode } from '@formkit/core';
import { plugin, defaultConfig, createInput } from '@formkit/vue';
import type { App } from 'vue';

import Listbox from '~/components/listbox/fk-listbox.vue';

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

export default function formkit(app: App): void {
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
    }),
  );
}

/**
 * Lifted from the FormKit tailwindcss plugin.
 * https://github.com/formkit/formkit/tree/master/packages/tailwindcss
 * https://github.com/formkit/formkit/blob/master/packages/tailwindcss/src/index.ts
 */

/**
 * An object of ClassFunctions
 * @internal
 */
interface FormKitClassFunctions {
  [index: string]: ClassFunction;
}

/**
 * A function that returns a class list string
 * @internal
 */
type ClassFunction = (node: FormKitNode) => string;

/**
 * A function to generate FormKit class functions from a javascript object
 * @param classes - An object of input types with nested objects of sectionKeys and class lists
 * @returns FormKitClassFunctions
 * @public
 */
export function generateClasses(
  classes: Record<string, Record<string, string>>,
): FormKitClassFunctions {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const classesBySectionKey: Record<string, Record<string, any>> = {};
  for (const type of Object.keys(classes)) {
    for (const sectionKey of Object.keys(classes[type])) {
      classesBySectionKey[sectionKey] ??= {};
      classesBySectionKey[sectionKey][type] = classes[type][sectionKey];
    }
  }
  for (const sectionKey of Object.keys(classesBySectionKey)) {
    const classesObject = classesBySectionKey[sectionKey];
    classesBySectionKey[sectionKey] = (node: FormKitNode): string =>
      formKitStates(node, classesObject);
  }
  return classesBySectionKey as FormKitClassFunctions;
}

function formKitStates(
  node: FormKitNode,
  classesByType: Record<string, () => string>,
): string {
  /* eslint-disable @typescript-eslint/no-unnecessary-condition */
  /* eslint-disable @typescript-eslint/restrict-plus-operands */
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  /* eslint-disable @typescript-eslint/strict-boolean-expressions */
  const { type } = node.props;
  let classList = '';
  if (classesByType.global) {
    classList += `${classesByType.global} `;
  }
  if (classesByType[type]) {
    classList += classesByType[type];
  }
  return classList.trim();
}
