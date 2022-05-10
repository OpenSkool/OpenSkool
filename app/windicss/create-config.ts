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
