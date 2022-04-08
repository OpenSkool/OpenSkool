import { Language } from '@prisma/client';
import gql from 'graphql-tag';
import { beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute } from './client';
import { createCompetencyFixture, createPersonFixture } from './fixtures';

beforeEach(async () => {
  await prisma.competency.deleteMany();
});

describe('createCompetency', () => {
  test('error on invalid title', async () => {
    const response = await execute<{ createCompetency: unknown }>(
      gql`
        mutation ($title: String!) {
          createCompetency(data: { title: $title }) {
            __typename
            ... on BaseError {
              code
              path
            }
          }
        }
      `,
      { variables: { title: '  ' } },
    );
    expect(response).toHaveProperty(
      'data.createCompetency.__typename',
      'InputError',
    );
    expect(response.data.createCompetency).toMatchObject({
      code: 'valueNotValid',
      path: ['title'],
    });
  });

  test('error on duplicate title at root', async () => {
    await createCompetencyFixture({ title: 'Hello Root!' });
    const response = await execute<{ createCompetency: unknown }>(
      gql`
        mutation ($title: String!) {
          createCompetency(data: { title: $title }) {
            __typename
            ... on BaseError {
              code
              path
            }
          }
        }
      `,
      { variables: { title: 'Hello Root!' } },
    );
    expect(response).toHaveProperty(
      'data.createCompetency.__typename',
      'InputError',
    );
    expect(response.data.createCompetency).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('error on duplicate title within same parent', async () => {
    const parent = await createCompetencyFixture({
      title: 'Hello Parent!',
    });
    await createCompetencyFixture({
      title: 'Hello Child!',
      parentId: parent.id,
    });
    const response = await execute<
      { createCompetency: unknown },
      { parentId: string; title: string }
    >(
      gql`
        mutation ($parentId: ID!, $title: String!) {
          createCompetency(data: { parentId: $parentId, title: $title }) {
            __typename
            ... on BaseError {
              code
              path
            }
          }
        }
      `,
      {
        variables: {
          parentId: parent.id,
          title: 'Hello Child!',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.createCompetency.__typename',
      'InputError',
    );
    expect(response.data.createCompetency).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('no error on duplicate title not within same parent', async () => {
    const person = await createPersonFixture();
    const parent1 = await createCompetencyFixture({ title: 'Hello Parent 1!' });
    const parent2 = await createCompetencyFixture({ title: 'Hello Parent 2!' });
    await createCompetencyFixture({
      title: 'Hello Child!',
      parentId: parent1.id,
    });
    const response = await execute<{ createCompetency: unknown }>(
      gql`
        mutation ($parentId: ID!, $title: String!) {
          createCompetency(data: { parentId: $parentId, title: $title }) {
            ... on CreateCompetencySuccessPayload {
              competency {
                id
              }
            }
          }
        }
      `,
      {
        spec: { userId: person.id },
        variables: {
          parentId: parent2.id,
          title: 'Hello Child!',
        },
      },
    );
    expect(response).toHaveProperty('data.createCompetency.competency');
  });

  test('no error on duplicate title with different locale', async () => {
    const person = await createPersonFixture();
    await createCompetencyFixture({
      title: 'Hello Root!',
      language: Language.EN,
    });
    const response = await execute<{ createCompetency: unknown }>(
      gql`
        mutation ($title: String!) {
          createCompetency(data: { title: $title }) {
            ... on CreateCompetencySuccessPayload {
              competency {
                id
              }
            }
          }
        }
      `,
      {
        spec: { locale: 'nl', userId: person.id },
        variables: { title: 'Hello Root!' },
      },
    );
    expect(response).toHaveProperty('data.createCompetency.competency');
  });

  test('should create root competency', async () => {
    const person = await createPersonFixture();
    const response = await execute<{ createCompetency: unknown }>(
      gql`
        mutation ($title: String!) {
          createCompetency(data: { title: $title }) {
            ... on CreateCompetencySuccessPayload {
              competency {
                __typename
              }
            }
          }
        }
      `,
      {
        spec: { userId: person.id },
        variables: { title: 'Hello World!' },
      },
    );
    expect(response.data).toHaveProperty(
      'createCompetency.competency.__typename',
      'Competency',
    );
  });

  test('should create nested competency', async () => {
    const person = await createPersonFixture();
    const parent = await createCompetencyFixture({ title: 'Parent Title' });
    const response = await execute<{ createCompetency: unknown }>(
      gql`
        mutation ($parentId: ID!, $title: String!) {
          createCompetency(data: { parentId: $parentId, title: $title }) {
            ... on CreateCompetencySuccessPayload {
              competency {
                __typename
              }
            }
          }
        }
      `,
      {
        spec: { userId: person.id },
        variables: {
          parentId: parent.id,
          title: 'Hello World!',
        },
      },
    );
    expect(response.data).toHaveProperty('createCompetency.competency');
    expect(response.data.createCompetency).toHaveProperty(
      'competency.__typename',
      'Competency',
    );
  });

  test('should create competency in user locale', async () => {
    const person = await createPersonFixture();
    const response = await execute<
      { createCompetency: { competency: { id: string } } },
      { title: string }
    >(
      gql`
        mutation ($title: String!) {
          createCompetency(data: { title: $title }) {
            ... on CreateCompetencySuccessPayload {
              competency {
                id
              }
            }
          }
        }
      `,
      {
        spec: { locale: 'nl', userId: person.id },
        variables: { title: 'Hello World!' },
      },
    );
    expect(response).toHaveProperty('data.createCompetency.competency.id');
    expect(
      await prisma.competency.findUnique({
        include: { translations: true },
        where: { id: response.data.createCompetency.competency.id },
      }),
    ).toMatchObject({
      translations: [{ languageCode: Language.NL, title: 'Hello World!' }],
    });
  });
});

describe('deleteCompetency', () => {
  test('should delete competency', async () => {
    const person = await createPersonFixture();
    const competency = await createCompetencyFixture();
    const response = await execute<
      { deleteCompetency: { id: string } },
      { id: string }
    >(
      gql`
        mutation ($id: ID!) {
          deleteCompetency(id: $id) {
            id
          }
        }
      `,
      {
        spec: { userId: person.id },
        variables: { id: competency.id },
      },
    );
    expect(response).toHaveProperty('data.deleteCompetency.id', competency.id);
    expect(
      await prisma.competency.findUnique({ where: { id: competency.id } }),
    ).toBe(null);
  });

  test('should delete competency and all its descendants', async () => {
    const person = await createPersonFixture();
    const root = await createCompetencyFixture();
    const parent = await createCompetencyFixture({ parentId: root.id });
    const child = await createCompetencyFixture({ parentId: parent.id });
    await execute<{ deleteCompetency: unknown }>(
      gql`
        mutation ($id: ID!) {
          deleteCompetency(id: $id) {
            id
          }
        }
      `,
      { spec: { userId: person.id }, variables: { id: root.id } },
    );
    expect(
      await prisma.competency.findUnique({ where: { id: child.id } }),
    ).toBe(null);
  });
});

describe('renameCompetency', () => {
  test('error on invalid title', async () => {
    const person = await createPersonFixture();

    const competency = await createCompetencyFixture();
    const response = await execute<{ renameCompetency: unknown }>(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            __typename
            ... on BaseError {
              code
              path
            }
          }
        }
      `,
      {
        spec: { userId: person.id },
        variables: {
          id: competency.id,
          title: '  ',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.renameCompetency.__typename',
      'InputError',
    );
    expect(response.data.renameCompetency).toMatchObject({
      code: 'valueNotValid',
      path: ['title'],
    });
  });

  test('error on duplicate title at root', async () => {
    await createCompetencyFixture({ title: 'Hello Root 1!' });
    const root2 = await createCompetencyFixture({ title: 'Hello Root 2!' });
    const response = await execute<{ renameCompetency: unknown }>(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            __typename
            ... on BaseError {
              code
              path
            }
          }
        }
      `,
      {
        variables: {
          id: root2.id,
          title: 'Hello Root 1!',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.renameCompetency.__typename',
      'InputError',
    );
    expect(response.data.renameCompetency).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('error on duplicate title within same parent', async () => {
    const parent = await createCompetencyFixture({ title: 'Hello Parent!' });
    await createCompetencyFixture({
      title: 'Hello Child 1!',
      parentId: parent.id,
    });
    const child2 = await createCompetencyFixture({
      title: 'Hello Child 2!',
      parentId: parent.id,
    });
    const response = await execute<{ renameCompetency: unknown }>(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            __typename
            ... on BaseError {
              code
              path
            }
          }
        }
      `,
      {
        variables: {
          id: child2.id,
          title: 'Hello Child 1!',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.renameCompetency.__typename',
      'InputError',
    );
    expect(response.data.renameCompetency).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('no error on duplicate title not within same parent', async () => {
    const person = await createPersonFixture();

    const parent1 = await createCompetencyFixture({ title: 'Hello Parent 1!' });
    await createCompetencyFixture({
      title: 'Hello Child 1!',
      parentId: parent1.id,
    });

    const parent2 = await createCompetencyFixture({ title: 'Hello Parent 2!' });
    const child2 = await createCompetencyFixture({
      title: 'Hello Child 2!',
      parentId: parent2.id,
    });

    const response = await execute<{ renameCompetency: unknown }>(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            ... on RenameCompetencySuccessPayload {
              competency {
                id
              }
            }
          }
        }
      `,
      {
        spec: { userId: person.id },
        variables: {
          id: child2.id,
          title: 'Hello Child 1!',
        },
      },
    );
    expect(response).toHaveProperty('data.renameCompetency.competency');
  });

  test('should rename competency', async () => {
    const person = await createPersonFixture();
    const competency = await createCompetencyFixture();
    const response = await execute<{ renameCompetency: unknown }>(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            ... on RenameCompetencySuccessPayload {
              competency {
                title
              }
            }
          }
        }
      `,
      {
        spec: { userId: person.id },
        variables: {
          id: competency.id,
          title: 'Hello Universe!',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.renameCompetency.competency.title',
      'Hello Universe!',
    );
  });
});
