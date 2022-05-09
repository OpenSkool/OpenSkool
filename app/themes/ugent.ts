import { baseColors, baseTheme, createConfig } from '../windicss';

export default createConfig({
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary: baseColors.secondary,
    secondary: baseColors.primary,
  },
  extend: {
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
});
