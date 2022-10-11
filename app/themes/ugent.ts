import {
	baseTheme,
	createConfig,
	generateRange,
	type baseColors,
} from '../windicss';

//  UGent Blue:
//    #1D64C8
//    https://oklch.evilmartians.io/#51.87,0.17,258.32,100
//    { chroma: 0.17, hue: 258.32 }

export default createConfig({
	...baseTheme,
	colors: {
		...baseTheme.colors,
		primary: generateRange({
			chroma: 0.17,
			hue: 258.32,
		}) as typeof baseColors.primary,
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
