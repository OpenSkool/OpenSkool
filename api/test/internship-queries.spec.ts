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
import { createEducationFixture, createUserFixture } from './fixtures';

let internship: { id: string };

beforeAll(async () => {
  const education = await createEducationFixture();

  internship = await prisma.internship.create({
    data: {
      course: { create: { name: 'Chemistry' } },
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
  await prisma.user.deleteMany({});
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
    const user = await createUserFixture();
    await prisma.internshipInstance.create({
      data: { studentId: user.id, internshipId: internship.id },
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
      { spec: { userId: user.id } },
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
    const user1 = await createUserFixture({ id: 'user-id-1' });
    const user2 = await createUserFixture({ id: 'user-id-2' });
    const instance = await prisma.internshipInstance.create({
      data: {
        student: { connect: { id: user1.id } },
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
        spec: { userId: user2.id },
        variables: { id: instance.id },
      },
    );
    expect(response).toHaveProperty('data.internshipInstance', null);
  });

  test('return null if not found', async () => {
    const user = await createUserFixture();
    const response = await execute(
      gql`
        query ($id: ID!) {
          internshipInstance(id: $id) {
            id
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: { id: 'id-does-not-exist' },
      },
    );
    expect(response).toHaveProperty('data.internshipInstance', null);
  });

  test('return internship position', async () => {
    const user = await createUserFixture();
    const organisation = await prisma.organisation.create({
      data: { name: 'Organisation' },
    });
    const instance = await prisma.internshipInstance.create({
      data: {
        internshipId: internship.id,
        studentId: user.id,
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
        spec: { userId: user.id },
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
