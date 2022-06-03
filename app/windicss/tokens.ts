import windiColors from 'windicss/colors';
import { Theme } from 'windicss/types/interfaces';

import { generateRange } from './color-helpers';

type WindiRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type WindiColors = {
  [Range in WindiRange as `${Range}00`]: string;
};

export interface OsColors {
  gray: WindiColors;
  primary: WindiColors;
  caution: WindiColors;
  danger: WindiColors;
  info: WindiColors;
  success: WindiColors;
}

export interface OsTheme {
  colors: OsColors;
  extend?: Theme;
}

//  OS Blue:
//    #2A6DF7
//    https://oklch.evilmartians.io/#57.65,0.218,262.38,100
//    { chroma: 0.218, hue: 262.38 }
//
//  OS Orange
//    #F6BF45
//    https://oklch.evilmartians.io/#83.35,0.147,83.57,100
//    { chroma: 0.147, hue: 83.57 }
//
//  OS Red:
//    #D32E64
//    https://oklch.evilmartians.io/#57.7,0.201,7.34,100
//    { chroma: 0.201, hue: 7.34 }

// Windi gray options:
//   'warmGray' | 'trueGray' | 'gray' | 'coolGray' | 'blueGray' | 'slate' | 'zinc' | 'neutral' | 'stone'

export const baseColors: OsColors = {
  gray: windiColors.slate as WindiColors,
  primary: generateRange({
    lightness: { from: 94 },
    chroma: 0.218,
    hue: 262.38,
  }) as WindiColors,
  caution: generateRange({
    lightness: { from: 99, to: 25 },
    chroma: 0.147,
    hue: 83.57,
  }) as WindiColors,
  danger: generateRange({
    lightness: { from: 93 },
    chroma: 0.201,
    hue: 7.34,
  }) as WindiColors,
  info: generateRange({
    lightness: { from: 90 },
    chroma: 0.204,
    hue: 293.91,
  }) as WindiColors,
  success: generateRange({
    lightness: { from: 90 },
    chroma: 0.082,
    hue: 126.93,
  }) as WindiColors,
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
