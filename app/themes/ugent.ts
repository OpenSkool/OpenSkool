import { defineConfig } from 'vite-plugin-windicss';
import colors from 'windicss/colors';

import { baseConfig, ExtendedColors } from '.';

const extendedColor: ExtendedColors = {
  primary1: colors.blue,
  primary2: colors.sky,
  secondary: colors.pink,
  error: colors.red,
  warning: colors.yellow,
};

export default defineConfig({
  ...baseConfig,
  theme: {
    extend: {
      colors: extendedColor,
      borderRadius: {
        none: '0',
        default: '0',
        sm: '0',
        md: '0',
        lg: '0.25rem',
        xl: '0.375rem',
        '2xl': '0.5rem',
        '3xl': '0.75rem',
        '4xl': '1rem',
      },
    },
  },
});
