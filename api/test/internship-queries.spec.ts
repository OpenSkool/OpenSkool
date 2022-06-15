import gql from 'graphql-tag';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute } from './client';
import { createUserFixture } from './fixtures';

let internship: { id: string };

beforeAll(async () => {
  internship = await prisma.internship.create({
    data: {
      courses: {
        create: {
          name: 'Chemistry',
        },
      },
    },
  });
});

beforeEach(async () => {
  await prisma.internshipInstance.deleteMany();
});

describe('InternshipInstance', () => {
  test('return empty array if no user', async () => {
    const response = await execute<{ id: string; courses: { name: string } }>(
      gql`
        query {
          myInternshipInstances {
            internship {
              id
              courses {
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
    const response = await execute<{ id: string; courses: { name: string } }>(
      gql`
        query {
          myInternshipInstances {
            internship {
              id
              courses {
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
        internship: { courses: [{ name: 'Chemistry' }], id: internship.id },
      },
    ]);
  });
});
