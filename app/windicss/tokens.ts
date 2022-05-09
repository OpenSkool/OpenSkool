import windiColors from 'windicss/colors';
import { Theme } from 'windicss/types/interfaces';

type ReasonableRange = 1 | 2 | 3 | 4 | 5 | 6;
export type ReasonableColors = {
  [Range in ReasonableRange as `${Range}00`]: string;
};

type WindiRange = ReasonableRange | 7 | 8 | 9;
export type WindiColors = {
  [Range in WindiRange as `${Range}00`]: string;
};

export interface OsColors {
  primary: ReasonableColors;
  secondary: ReasonableColors;
  tertiary: ReasonableColors;

  caution: ReasonableColors;
  danger: ReasonableColors;
  success: ReasonableColors;

  gray: WindiColors;
}

export interface OsTheme {
  colors: OsColors;
  extend?: Theme;
}

export const baseColors: OsColors = {
  primary: {
    100: '#fff6e7',
    200: '#fff5bf',
    300: '#f6bf44',
    400: '#c3931b',
    500: '#7d5500',
    600: '#402200',
  },
  secondary: {
    100: '#dcf9ff',
    200: '#c0e0ff',
    300: '#2a6ef6',
    400: '#005ade',
    500: '#00107c',
    600: '#000039',
  },
  tertiary: {
    100: '#ffe2e8',
    200: '#ffb9dd',
    300: '#d32e64',
    400: '#c31457',
    500: '#830028',
    600: '#440004',
  },
  caution: {
    100: '#fff6e7',
    200: '#fff5bf',
    300: '#f6bf44',
    400: '#c3931b',
    500: '#7d5500',
    600: '#402200',
  },
  danger: {
    100: '#ffefe9',
    200: '#ffd3c3',
    300: '#f54242',
    400: '#d00c2a',
    500: '#7b0000',
    600: '#3f0000',
  },
  success: {
    100: '#e0ffe2',
    200: '#b0ffb5',
    300: '#79de81',
    400: '#44a952',
    500: '#00691a',
    600: '#004200',
  },
  // Gray options: 'warmGray' | 'trueGray' | 'gray' | 'coolGray' | 'blueGray' | 'slate' | 'zinc' | 'neutral' | 'stone'
  gray: windiColors.gray as WindiColors,
};

export const baseTheme: OsTheme = {
  colors: baseColors,
  extend: {
    fontSize: {
      // https://www.fluid-type-scale.com/calculate?minFontSize=16&minWidth=375&minRatio=1.25&maxFontSize=19&maxWidth=1536&maxRatio=1.333&steps=xs%2Csm%2Cbase%2Clg%2Cxl%2C2xl%2C3xl%2C4xl%2C5xl%2C6xl%2C7xl%2C8xl&baseStep=base&prefix=font-size&decimals=2&useRems=on&previewFont=Inter
      xs: 'clamp(0.64rem, 0.04vw + 0.63rem, 0.67rem)',
      sm: 'clamp(0.8rem, 0.13vw + 0.77rem, 0.89rem)',
      base: 'clamp(1rem, 0.26vw + 0.94rem, 1.19rem)',
      lg: 'clamp(1.25rem, 0.46vw + 1.14rem, 1.58rem)',
      xl: 'clamp(1.56rem, 0.75vw + 1.39rem, 2.11rem)',
      '2xl': 'clamp(1.95rem, 1.18vw + 1.68rem, 2.81rem)',
      '3xl': 'clamp(2.44rem, 1.8vw + 2.02rem, 3.75rem)',
      '4xl': 'clamp(3.05rem, 2.68vw + 2.42rem, 5rem)',
      '5xl': 'clamp(3.81rem, 3.92vw + 2.89rem, 6.66rem)',
      '6xl': 'clamp(4.77rem, 5.67vw + 3.44rem, 8.88rem)',
      '7xl': 'clamp(5.96rem, 8.1vw + 4.06rem, 11.84rem)',
      '8xl': 'clamp(7.45rem, 11.48vw + 4.76rem, 15.78rem)',
    },
  },
};
