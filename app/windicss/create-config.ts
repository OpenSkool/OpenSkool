import windiColors from 'windicss/colors';
import { DefaultColors } from 'windicss/types/config/colors';
import { FullConfig } from 'windicss/types/interfaces';

import formkit from './plugin-formkit';
import { OsTheme } from './tokens';

const BASE_COLORS = [
  // CSS
  'current',
  'inherit',
  'transparent',
  // B/W
  'black',
  'white',
];

const WINDI_COLORS = ['dark', 'light', 'neutral', 'slate', 'stone', 'zinc'];

export default function createConfig(theme: OsTheme): FullConfig {
  return {
    attributify: true,
    plugins: [formkit],
    shortcuts: {
      btn: 'inline-flex rounded-lg font-medium text-base select-none px-10 py-2 cursor-pointer',
      'btn-primary': `
        bg-primary-300 hover:bg-primary-400 text-primary-600
        focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-500)
      `,
      'btn-primary-outline': `
        text-primary-600
        focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-500)
      `,
    },
    theme: {
      ...theme,
      colors: {
        ...theme.colors,
        ...BASE_COLORS.reduce(
          (base, color) => ({ ...base, [color]: color }),
          {},
        ),
        ...WINDI_COLORS.reduce(
          (base, color) => ({
            ...base,
            [color]: windiColors[color as keyof DefaultColors],
          }),
          {},
        ),
      },
    },
  };
}
