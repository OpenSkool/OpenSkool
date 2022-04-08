import { CompetencyFramework, Language } from '@prisma/client';
import gql from 'graphql-tag';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute } from './client';
import {
  createCompetencyFixture,
  createCompetencyFrameworkFixture,
  createPersonFixture,
} from './fixtures';

beforeEach(async () => {
  await prisma.competency.deleteMany();
});

describe('createCompetency', () => {
  let framework: CompetencyFramework;

  beforeAll(async () => {
    framework = await createCompetencyFrameworkFixture();
  });

  test('error on invalid title', async () => {
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
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
          frameworkId: framework.id,
          title: '  ',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.createRootCompetency.__typename',
      'InputError',
    );
    expect(response.data.createRootCompetency).toMatchObject({
      code: 'valueNotValid',
      path: ['title'],
    });
  });

  test('no error on duplicate title with different locale', async () => {
    const person = await createPersonFixture();
    await createCompetencyFixture({
      title: 'Hello Root!',
      language: Language.EN,
    });
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
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
        variables: { frameworkId: framework.id, title: 'Hello Root!' },
      },
    );
    expect(response).toHaveProperty('data.createRootCompetency.competency');
  });

  test('should create competency in user locale', async () => {
    const person = await createPersonFixture();
    const response = await execute<{
      createRootCompetency: { competency: { id: string } };
    }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
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
        variables: { frameworkId: framework.id, title: 'Hello World!' },
      },
    );
    expect(response).toHaveProperty('data.createRootCompetency.competency.id');
    expect(
      await prisma.competency.findUnique({
        include: { translations: true },
        where: { id: response.data.createRootCompetency.competency.id },
      }),
    ).toMatchObject({
      translations: [{ languageCode: Language.NL, title: 'Hello World!' }],
    });
  });
});

describe('createNestedCompetency', () => {
  test('error on duplicate title within same parent', async () => {
    const parent = await createCompetencyFixture({
      title: 'Hello Parent!',
    });
    await createCompetencyFixture({
      title: 'Hello Child!',
      parentId: parent.id,
    });
    const response = await execute<{ createNestedCompetency: unknown }>(
      gql`
        mutation ($parentId: ID!, $title: String!) {
          createNestedCompetency(data: { parentId: $parentId, title: $title }) {
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
      'data.createNestedCompetency.__typename',
      'InputError',
    );
    expect(response.data.createNestedCompetency).toMatchObject({
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
          createNestedCompetency(data: { parentId: $parentId, title: $title }) {
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
    expect(response).toHaveProperty('data.createNestedCompetency.competency');
  });

  test('should create nested competency', async () => {
    const person = await createPersonFixture();
    const parent = await createCompetencyFixture({ title: 'Parent Title' });
    const response = await execute<{ createNestedCompetency: unknown }>(
      gql`
        mutation ($parentId: ID!, $title: String!) {
          createNestedCompetency(data: { parentId: $parentId, title: $title }) {
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
    expect(response.data).toHaveProperty('createNestedCompetency.competency');
    expect(response.data.createNestedCompetency).toHaveProperty(
      'competency.__typename',
      'Competency',
    );
  });
});

describe('createRootCompetency', () => {
  let framework: CompetencyFramework;

  beforeAll(async () => {
    framework = await createCompetencyFrameworkFixture();
  });

  test('error on duplicate title at root', async () => {
    await createCompetencyFixture({ title: 'Hello Root!' });
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
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
          frameworkId: framework.id,
          title: 'Hello Root!',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.createRootCompetency.__typename',
      'InputError',
    );
    expect(response.data.createRootCompetency).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('should create root competency', async () => {
    const person = await createPersonFixture();
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
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
          frameworkId: framework.id,
          title: 'Hello Root!',
        },
      },
    );
    expect(response.data).toHaveProperty(
      'createRootCompetency.competency.__typename',
      'Competency',
    );
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
