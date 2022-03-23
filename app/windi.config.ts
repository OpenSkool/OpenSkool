import { defineConfig } from 'vite-plugin-windicss';
import colors from 'windicss/colors';

import { ExtendedColors } from './themes/types';

const extendedColor: ExtendedColors = {
  primary1: colors.amber,
  primary2: colors.orange,
  secondary: colors.pink,
  error: colors.emerald,
  warning: colors.yellow,
};

export default defineConfig({
  theme: {
    extend: {
      colors: extendedColor,
    },
  },
});
