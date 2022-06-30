import Color from 'colorjs.io';

/* eslint-disable @typescript-eslint/no-magic-numbers */

const percentageToHex = (number: number): string =>
  Math.round(number * 255)
    .toString(16)
    .padStart(2, '0');

export function generateRange({
  lightness: { from = 0.95, steps = 9, to = 0.17 } = {},
  chroma = 0.162,
  hue,
}: {
  lightness?: { from?: number; steps?: number; to?: number };
  chroma?: number;
  hue: number;
}): Record<string, string> {
  if (
    from < to ||
    from > 0.99 ||
    to < 0.15 ||
    chroma < 0 ||
    chroma > 0.23 ||
    hue < 0 ||
    hue > 360
  ) {
    throw new RangeError('oklch color range out of bounds');
  }
  // console.log(`-- RANGE ${chroma} / ${hue} --`);
  const range: Record<string, string> = {};
  const lightnessGap = (from - to) / (steps - 1);
  let lightness = from;
  for (let step = 1; step <= steps; step += 1) {
    // console.log(`-- step ${step} – lch ${lightness}% ${chroma} ${hue} --`);
    const color = new Color('oklch', [lightness, chroma, hue])
      .to('srgb')
      .toGamut();
    range[`${step}00`] = `#${color.coords.map(percentageToHex).join('')}`;
    lightness -= lightnessGap;
  }
  return range;
}
