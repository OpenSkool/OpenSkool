import { faker } from '@faker-js/faker';
import { Language } from '@prisma/client';
import gql from 'graphql-tag';
import { createMercuriusTestClient } from 'mercurius-integration-testing';
import { expect, test } from 'vitest';

import app from '../src/app';
import { NexusGenFieldTypes } from '../src/generated/nexus';
import { prisma } from '../src/prisma';

test('create educations', async () => {
  const title = faker.commerce.productName();
  const client = createMercuriusTestClient(app);
  const response = await client.mutate<
    { createEducation: Pick<NexusGenFieldTypes['Education'], 'id' | 'title'> },
    { title: string }
  >(
    gql`
      mutation ($title: String!) {
        createEducation(data: { title: $title }) {
          id
          title
        }
      }
    `,
    { variables: { title } },
  );
  expect(response).not.toHaveProperty('errors');
  expect(response).toHaveProperty('data.createEducation');
  const { createEducation } = response.data;
  expect(createEducation).toMatchObject({ title });
  expect(
    await prisma.education.findUnique({
      where: { id: createEducation.id },
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
  const client = createMercuriusTestClient(app);
  const response = await client.mutate<
    { updateEducation: Pick<NexusGenFieldTypes['Education'], 'id' | 'title'> },
    { id: string; title: string }
  >(
    gql`
      mutation ($id: ID!, $title: String!) {
        updateEducation(id: $id, data: { title: $title }) {
          id
          title
        }
      }
    `,
    { variables: { id: education.id, title } },
  );
  expect(response).not.toHaveProperty('errors');
  expect(response).toHaveProperty('data.updateEducation');
  const { updateEducation } = response.data;
  expect(updateEducation).toMatchObject({ title });
  expect(
    await prisma.education.findUnique({
      where: { id: updateEducation.id },
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
  const client = createMercuriusTestClient(app);
  const response = await client.mutate<
    { deleteEducation: Pick<NexusGenFieldTypes['Education'], 'id'> },
    { id: string }
  >(
    gql`
      mutation ($id: ID!) {
        deleteEducation(id: $id) {
          id
        }
      }
    `,
    { variables: { id: education.id } },
  );
  expect(response).not.toHaveProperty('errors');
  expect(response).toHaveProperty('data.deleteEducation');
  const { deleteEducation } = response.data;
  expect(
    await prisma.education.findUnique({ where: { id: deleteEducation.id } }),
  ).toBe(null);
});
