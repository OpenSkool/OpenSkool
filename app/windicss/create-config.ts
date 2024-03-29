import windiColors from 'windicss/colors';
import aspectRatio from 'windicss/plugin/aspect-ratio';
import type { DefaultColors } from 'windicss/types/config/colors';
import type { FullConfig } from 'windicss/types/interfaces';

import formkit from './plugin-formkit';
import type { OsTheme } from './tokens';

const BASE_COLORS = [
	// CSS
	'current',
	'inherit',
	'transparent',
	// B/W
	'black',
	'white',
];

const WINDI_COLORS = ['dark', 'light', 'stone'];

export default function createConfig(theme: OsTheme): FullConfig {
	return {
		attributify: true,
		plugins: [aspectRatio, formkit],
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
