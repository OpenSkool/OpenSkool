import type { Config } from 'windicss/types/interfaces';

import formkit from './plugin-formkit';

const base: Config = {
  attributify: true,
  plugins: [formkit],
  shortcuts: {
    btn: 'inline-flex rounded-lg font-medium select-none px-10 py-2 cursor-pointer',
    'btn-primary': `
      bg-primary1-100 hover:bg-primary1-200 text-primary1-900
      focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary1-500)
    `,
  },
};

export default base;
