/* eslint-disable-next-line import/no-unresolved */
import { faker } from '@faker-js/faker';
import gql from 'graphql-tag';
import { createMercuriusTestClient } from 'mercurius-integration-testing';
import { expect, test } from 'vitest';

import app from '../app';

test('create educations', async () => {
  const name = faker.commerce.productName();
  const client = createMercuriusTestClient(app);
  const {
    data: { createEducation },
  } = await client.mutate<
    { createEducation: { id: string; name: string } },
    { name: string }
  >(
    gql`
      mutation ($name: String!) {
        createEducation(name: $name) {
          id
          name
        }
      }
    `,
    { variables: { name } },
  );
  expect(createEducation).toMatchObject({ name });
  expect(
    await app.prisma.education.findUnique({
      where: { id: createEducation.id },
    }),
  ).toMatchObject({ name });
});

test('update education', async () => {
  const education = await app.prisma.education.create({
    data: {
      name: faker.commerce.productName(),
    },
  });
  const name = faker.commerce.productName();
  const client = createMercuriusTestClient(app);
  const {
    data: { updateEducation },
  } = await client.mutate<
    { updateEducation: { id: string; name: string } },
    { id: string; name: string }
  >(
    gql`
      mutation ($id: ID!, $name: String!) {
        updateEducation(id: $id, name: $name) {
          id
          name
        }
      }
    `,
    { variables: { id: education.id, name } },
  );
  expect(updateEducation).toMatchObject({ name });
});

test('delete education', async () => {
  const education = await app.prisma.education.create({
    data: {
      name: faker.commerce.productName(),
    },
  });
  const client = createMercuriusTestClient(app);
  const {
    data: { deleteEducation },
  } = await client.mutate<{ deleteEducation: { id: string } }, { id: string }>(
    gql`
      mutation ($id: ID!) {
        deleteEducation(id: $id) {
          id
          name
        }
      }
    `,
    { variables: { id: education.id } },
  );
  expect(deleteEducation).toMatchObject(education);
  expect(
    await app.prisma.education.findUnique({ where: { id: education.id } }),
  ).toBe(null);
});
