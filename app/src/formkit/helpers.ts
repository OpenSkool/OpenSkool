import type { FormKitNode } from '@formkit/core';

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
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const classesBySectionKey: Record<string, Record<string, any>> = {};
  for (const type of Object.keys(classes)) {
    for (const sectionKey of Object.keys(classes[type]!)) {
      classesBySectionKey[sectionKey] ??= {};
      classesBySectionKey[sectionKey]![type] = classes[type]![sectionKey];
    }
  }
  for (const sectionKey of Object.keys(classesBySectionKey)) {
    const classesObject = classesBySectionKey[sectionKey]!;
    classesBySectionKey[sectionKey] = (node: FormKitNode): string =>
      formKitStates(node, classesObject);
  }
  return classesBySectionKey as FormKitClassFunctions;
}

function formKitStates(
  node: FormKitNode,
  classesByType: Record<string, () => string>,
): string {
  /* eslint-disable @typescript-eslint/restrict-plus-operands */
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */

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
