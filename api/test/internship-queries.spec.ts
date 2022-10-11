import cuid from 'cuid';
import gql from 'graphql-tag';
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from 'vitest';

import { prisma } from '../src/prisma';
import { execute } from './client';
import { createEducationFixture } from './fixtures';

let internship: { id: string };

beforeAll(async () => {
	const education = await createEducationFixture();

	internship = await prisma.internship.create({
		data: {
			course: { create: { name: 'Chemistry' } },
			dateFrom: new Date(),
			dateTo: new Date(),
			descriptionLong: 'Long description',
			descriptionShort: 'Short description',
			education: { connect: { id: education.id } },
			title: 'Internship Test',
		},
	});
});

beforeEach(async () => {
	await prisma.internshipPosition.deleteMany({});
	await prisma.internshipInstance.deleteMany({});
});

describe('myInternshipInstances', () => {
	test('return empty array if no user', async () => {
		const response = await execute<{ id: string; course: { name: string } }>(
			gql`
				query {
					myInternshipInstances {
						internship {
							id
							course {
								name
							}
						}
					}
				}
			`,
			{ spec: { userId: undefined } },
		);
		expect(response).toHaveProperty('data.myInternshipInstances', []);
	});

	test('return an array internship instances', async () => {
		const userId = cuid();
		await prisma.internshipInstance.create({
			data: { studentId: userId, internshipId: internship.id },
		});
		const response = await execute<{ id: string; course: { name: string } }>(
			gql`
				query {
					myInternshipInstances {
						internship {
							id
							course {
								name
							}
						}
					}
				}
			`,
			{ spec: { userId } },
		);
		expect(response).toHaveProperty('data.myInternshipInstances', [
			{
				internship: { course: { name: 'Chemistry' }, id: internship.id },
			},
		]);
	});
});

describe('internshipInstance', () => {
	test('return null if not authorized', async () => {
		const userId1 = cuid();
		const userId2 = cuid();
		const instance = await prisma.internshipInstance.create({
			data: {
				studentId: userId1,
				internship: { connect: { id: internship.id } },
			},
		});
		const response = await execute(
			gql`
				query ($id: ID!) {
					internshipInstance(id: $id) {
						id
					}
				}
			`,
			{
				spec: { userId: userId2 },
				variables: { id: instance.id },
			},
		);
		expect(response).toHaveProperty('data.internshipInstance', null);
	});

	test('return null if not found', async () => {
		const response = await execute(
			gql`
				query ($id: ID!) {
					internshipInstance(id: $id) {
						id
					}
				}
			`,
			{
				spec: { userId: cuid() },
				variables: { id: 'id-does-not-exist' },
			},
		);
		expect(response).toHaveProperty('data.internshipInstance', null);
	});

	test('return internship position', async () => {
		const userId = cuid();
		const organisation = await prisma.organisation.create({
			data: { name: 'Organisation' },
		});
		const instance = await prisma.internshipInstance.create({
			data: {
				internshipId: internship.id,
				studentId: userId,
			},
		});
		await prisma.internshipPosition.create({
			data: {
				description: 'Internship position',
				internships: { connect: { id: internship.id } },
				organisationId: organisation.id,
			},
		});
		const response = await execute(
			gql`
				query ($id: ID!) {
					internshipInstance(id: $id) {
						internship {
							availablePositions {
								organisation {
									name
								}
								summary
							}
						}
					}
				}
			`,
			{
				spec: { userId },
				variables: { id: instance.id },
			},
		);
		expect(response).toHaveProperty(
			'data.internshipInstance.internship.availablePositions',
			[
				{
					organisation: { name: 'Organisation' },
					summary: 'Internship position',
				},
			],
		);
	});
});

afterAll(async () => {
	await prisma.internshipInstance.deleteMany({});
	await prisma.internship.deleteMany({});
});
