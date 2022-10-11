'use strict';

const { gray } = require('colorette');

const LEVELS = {
	10: '✏️', // trace
	20: '🔎', // debug
	30: '✨', // info
	40: '⚠️ ', // warn
	50: '‼️', // error
	60: '💥', // fatal
};

module.exports = {
	customPrettifiers: {
		time: (value) => gray(value),
		level: (value) => `${LEVELS[value]} `,
	},
	ignore: 'hostname,pid',
};
