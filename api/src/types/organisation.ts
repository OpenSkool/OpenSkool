import { faker } from '@faker-js/faker';
import cuid from 'cuid';

import type { OrganisationModel } from '~/domain';
import builder from '~/schema/builder';
import { cacheFakeData } from '~/schema/helpers';
import { generateFakePerson, Person } from '~/types/person';
import { times } from '~/utils';

import { Node } from './node';

export const Organisation =
	builder.objectRef<OrganisationModel>('Organisation');

export interface WorkplaceModel {
	id: string;
	plainAddress: string;
}

export const Workplace = builder.objectRef<WorkplaceModel>('Workplace');

builder.prismaObject('Organisation', {
	description:
		'An organisation can be a commercial company, a non-profit or an educational institution.',
	interfaces: [Node],
	fields: (t) => ({
		id: t.exposeID('id'),
		employees: t.field({
			type: [Person],
			resolve(organisation) {
				/* eslint-disable @typescript-eslint/no-magic-numbers */
				return cacheFakeData(`organisation-${organisation.id}-employees`, () =>
					times(faker.mersenne.rand(4, 1), generateFakePerson),
				);
			},
		}),
		imageUrl: t.string({
			resolve(organisation) {
				return cacheFakeData(
					`organisation-${organisation.id}-image-url`,
					() => {
						const businessImageUrl = new URL(faker.image.business(640, 360));
						businessImageUrl.searchParams.set('organisation', organisation.id);
						return businessImageUrl.toString();
					},
				);
			},
		}),
		name: t.exposeString('name'),
		plainAddress: t.string({
			resolve(organisation) {
				return cacheFakeData(
					`organisation-${organisation.id}-plain-address`,
					generateFakePlainAddress,
				);
			},
		}),
		workplaces: t.field({
			type: [Workplace],
			resolve(organisation) {
				/* eslint-disable @typescript-eslint/no-magic-numbers */
				return cacheFakeData(`organisation-${organisation.id}-workplaces`, () =>
					times(faker.mersenne.rand(4, 1), generateFakeWorkplace),
				);
			},
		}),
		urls: t.stringList({
			resolve: () => times(faker.mersenne.rand(3), () => faker.internet.url()),
		}),
	}),
});

builder.objectType(Workplace, {
	name: 'Workplace',
	description:
		'This is the location, address where the internship will be executed,',
	interfaces: [Node],
	fields: (t) => ({
		id: t.exposeID('id'),
		plainAddress: t.exposeString('plainAddress'),
	}),
});

function generateFakePlainAddress(): string {
	return `${faker.address.streetAddress()}, ${faker.address.zipCode(
		'####',
	)} ${faker.address.cityName()}`;
}

export function generateFakeWorkplace(): WorkplaceModel {
	return {
		id: cuid(),
		plainAddress: generateFakePlainAddress(),
	};
}
