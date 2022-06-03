import { oklchToSRgb } from '@os/css-color-4';

/* eslint-disable @typescript-eslint/no-magic-numbers */

const toHex = (number: number, maxLength = 2): string =>
  number.toString(16).padStart(maxLength, '0');

export function generateRange({
  lightness: { from = 95, steps = 9, to = 17 } = {},
  chroma = 0.162,
  hue,
}: {
  lightness?: { from?: number; steps?: number; to?: number };
  chroma?: number;
  hue: number;
}): Record<string, string> {
  if (
    from < to ||
    from > 99 ||
    to < 15 ||
    chroma < 0 ||
    chroma > 230 ||
    hue < 0 ||
    hue > 360
  ) {
    throw new RangeError('HCL color range out of bounds');
  }
  // console.log(`-- RANGE ${chroma} / ${hue} --`);
  const range: Record<string, string> = {};
  const lightnessGap = (from - to) / (steps - 1);
  let lightness = from;
  for (let step = 1; step <= steps; step += 1) {
    const [r, g, b] = oklchToSRgb([lightness / 100, chroma, hue]);
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    // console.log(
    //   `step ${step} – rgb: ${r} ${g} ${b} – lch ${lightness}% ${chroma} ${hue} – hex ${hex}`,
    // );
    range[`${step}00`] = hex;
    lightness -= lightnessGap;
  }
  return range;
}
