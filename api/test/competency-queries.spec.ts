import { Language } from '@prisma/client';
import gql from 'graphql-tag';
import { beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute } from './client';
import {
	createCompetencyFixture,
	createCompetencyFrameworkFixture,
} from './fixtures';

beforeEach(async () => {
	await prisma.competency.deleteMany();
});

describe('competency', () => {
	test('error on competency not found', async () => {
		const response = await execute<
			{ competency: { title: string } },
			{ id: string }
		>(
			gql`
				query ($id: ID!) {
					competency(id: $id) {
						... on UserError {
							code
							message
						}
					}
				}
			`,
			{ variables: { id: 'id-does-not-exist' } },
		);
		expect(response).not.toHaveProperty('errors');
		expect(response).toHaveProperty('data.competency.code', 'AE404');
	});

	test('get title in default locale with user preferred locale', async () => {
		const competency = await createCompetencyFixture({
			language: Language.EN,
			title: 'Hello World!',
		});
		const response = await execute<{ competency: { title: string } }>(
			gql`
				query ($id: ID!) {
					competency(id: $id) {
						... on QueryCompetencySuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.EN },
				variables: { id: competency.id },
			},
		);
		expect(response.errors).toBeUndefined();
		expect(response).toHaveProperty(
			'data.competency.data.title',
			'Hello World!',
		);
	});

	test('get title in default locale with user fallback locale', async () => {
		const competency = await createCompetencyFixture({
			language: Language.EN,
			title: 'Hello World!',
		});
		const response = await execute<{ competency: { title: string } }>(
			gql`
				query ($id: ID!) {
					competency(id: $id) {
						... on QueryCompetencySuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.EN },
				variables: { id: competency.id },
			},
		);
		expect(response.errors).toBeUndefined();
		expect(response).toHaveProperty(
			'data.competency.data.title',
			'Hello World!',
		);
	});

	test('get title in other locale with user preferred locale', async () => {
		const competency = await createCompetencyFixture({
			language: Language.NL,
			title: 'Hallo Wereld!',
		});
		const response = await execute<{ competency: { title: string } }>(
			gql`
				query ($id: ID!) {
					competency(id: $id) {
						... on QueryCompetencySuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.NL },
				variables: { id: competency.id },
			},
		);
		expect(response.errors).toBeUndefined();
		expect(response).toHaveProperty(
			'data.competency.data.title',
			'Hallo Wereld!',
		);
	});

	test('get title in other locale with user fallback locale', async () => {
		const competency = await createCompetencyFixture({
			language: Language.NL,
			title: 'Hallo Wereld!',
		});
		const response = await execute<{ competency: { title: string } }>(
			gql`
				query ($id: ID!) {
					competency(id: $id) {
						... on QueryCompetencySuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.EN },
				variables: { id: competency.id },
			},
		);
		expect(response.errors).toBeUndefined();
		expect(response).toHaveProperty(
			'data.competency.data.title',
			'Hallo Wereld!',
		);
	});
});

describe('CompetencyFramework', () => {
	beforeEach(async () => {
		await prisma.competencyFramework.deleteMany();
	});

	test('return an error if the competency framework is not found', async () => {
		const response = await execute<{ competencyFramework: { title: string } }>(
			gql`
				query ($id: ID!) {
					competencyFramework(id: $id) {
						... on UserError {
							code
							message
						}
					}
				}
			`,
			{
				variables: { id: 'non-existing-id' },
			},
		);
		expect(response).not.toHaveProperty('errors');
		expect(response).toHaveProperty('data.competencyFramework.code', 'AE404');
	});

	test('return a competency framework with the given ID', async () => {
		const competencyFramework = await createCompetencyFrameworkFixture({
			language: Language.NL,
			title: 'Hallo Wereld!',
		});
		const response = await execute<{ competencyFramework: { title: string } }>(
			gql`
				query ($id: ID!) {
					competencyFramework(id: $id) {
						... on QueryCompetencyFrameworkSuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.NL },
				variables: { id: competencyFramework.id },
			},
		);
		expect(response).not.toHaveProperty('errors');
		expect(response).toHaveProperty(
			'data.competencyFramework.data.title',
			'Hallo Wereld!',
		);
	});

	test('get title in default locale with user preferred locale', async () => {
		const competencyFramework = await createCompetencyFrameworkFixture({
			language: Language.EN,
			title: 'Hello World!',
		});
		const response = await execute<{ competencyFramework: { title: string } }>(
			gql`
				query ($id: ID!) {
					competencyFramework(id: $id) {
						... on QueryCompetencyFrameworkSuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.EN },
				variables: { id: competencyFramework.id },
			},
		);
		expect(response.errors).toBeUndefined();
		expect(response).toHaveProperty(
			'data.competencyFramework.data.title',
			'Hello World!',
		);
	});

	test('get title in default locale with user fallback locale', async () => {
		const competencyFramework = await createCompetencyFrameworkFixture({
			language: Language.EN,
			title: 'Hello World!',
		});
		const response = await execute<{ competencyFramework: { title: string } }>(
			gql`
				query ($id: ID!) {
					competencyFramework(id: $id) {
						... on QueryCompetencyFrameworkSuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.EN },
				variables: { id: competencyFramework.id },
			},
		);
		expect(response.errors).toBeUndefined();
		expect(response).toHaveProperty(
			'data.competencyFramework.data.title',
			'Hello World!',
		);
	});

	test('get title in other locale with user preferred locale', async () => {
		const competencyFramework = await createCompetencyFrameworkFixture({
			language: Language.NL,
			title: 'Hallo Wereld!',
		});
		const response = await execute<{ competencyFramework: { title: string } }>(
			gql`
				query ($id: ID!) {
					competencyFramework(id: $id) {
						... on QueryCompetencyFrameworkSuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.NL },
				variables: { id: competencyFramework.id },
			},
		);
		expect(response.errors).toBeUndefined();
		expect(response).toHaveProperty(
			'data.competencyFramework.data.title',
			'Hallo Wereld!',
		);
	});

	test('get title in other locale with user fallback locale', async () => {
		const competencyFramework = await createCompetencyFrameworkFixture({
			language: Language.NL,
			title: 'Hallo Wereld!',
		});
		const response = await execute<{ competencyFramework: { title: string } }>(
			gql`
				query ($id: ID!) {
					competencyFramework(id: $id) {
						... on QueryCompetencyFrameworkSuccess {
							data {
								title
							}
						}
					}
				}
			`,
			{
				spec: { locale: Language.EN },
				variables: { id: competencyFramework.id },
			},
		);
		expect(response.errors).toBeUndefined();
		expect(response).toHaveProperty(
			'data.competencyFramework.data.title',
			'Hallo Wereld!',
		);
	});
});
