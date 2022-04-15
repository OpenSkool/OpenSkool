import { faker } from '@faker-js/faker';
import { Language } from '@prisma/client';
import gql from 'graphql-tag';
import { expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute } from './client';

test('create educations', async () => {
  const title = faker.commerce.productName();
  const response = await execute<
    { createEducation: { data: { id: string } } },
    { title: string }
  >(
    gql`
      mutation ($title: String!) {
        createEducation(data: { title: $title }) {
          ... on MutationCreateEducationSuccess {
            data {
              id
            }
          }
        }
      }
    `,
    { variables: { title } },
  );
  console.dir(response.errors);
  expect(response).not.toHaveProperty('errors');
  expect(response).toHaveProperty('data.createEducation.data.id');
  const { createEducation } = response.data;
  expect(
    await prisma.education.findUnique({
      where: { id: createEducation.data.id },
      include: { translations: true },
    }),
  ).toMatchObject({
    translations: [{ languageCode: Language.EN, title }],
  });
});

test('update education', async () => {
  const education = await prisma.education.create({
    data: {
      translations: {
        create: {
          languageCode: Language.EN,
          title: faker.commerce.productName(),
        },
      },
    },
  });
  const title = faker.commerce.productName();
  const response = await execute<
    { updateEducation: { data: { id: string } } },
    { id: string; title: string }
  >(
    gql`
      mutation ($id: ID!, $title: String!) {
        updateEducation(id: $id, data: { title: $title }) {
          ... on MutationUpdateEducationSuccess {
            data {
              id
            }
          }
        }
      }
    `,
    { variables: { id: education.id, title } },
  );
  expect(response).not.toHaveProperty('errors');
  expect(response).toHaveProperty('data.updateEducation.data.id');
  const { updateEducation } = response.data;
  expect(
    await prisma.education.findUnique({
      where: { id: updateEducation.data.id },
      include: { translations: true },
    }),
  ).toMatchObject({
    translations: [{ languageCode: Language.EN, title }],
  });
});

test('delete education', async () => {
  const education = await prisma.education.create({
    data: {
      translations: {
        create: {
          languageCode: Language.EN,
          title: faker.commerce.productName(),
        },
      },
    },
  });
  const response = await execute<
    { deleteEducation: { data: { id: string } } },
    { id: string }
  >(
    gql`
      mutation ($id: ID!) {
        deleteEducation(id: $id) {
          ... on MutationDeleteEducationSuccess {
            data {
              id
            }
          }
        }
      }
    `,
    { variables: { id: education.id } },
  );
  expect(response).not.toHaveProperty('errors');
  expect(response).toHaveProperty('data.deleteEducation.data.id');
  const { deleteEducation } = response.data;
  expect(
    await prisma.education.findUnique({
      where: { id: deleteEducation.data.id },
    }),
  ).toBe(null);
});
