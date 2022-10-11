import { faker } from '@faker-js/faker';

import builder from '~/schema/builder';
import { times } from '~/utils';

import { Node } from './node';

export const Course = builder.prismaObject('Course', {
	interfaces: [Node],
	fields: (t) => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		urls: t.stringList({
			/* eslint-disable @typescript-eslint/no-magic-numbers */
			resolve: () => times(faker.mersenne.rand(3), () => faker.internet.url()),
		}),
	}),
});
