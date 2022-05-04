import { CompetencyFramework, Language } from '@prisma/client';
import gql from 'graphql-tag';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute, GraphQlResponse } from './client';
import {
  createCompetencyFixture,
  createCompetencyFrameworkFixture,
  createUserFixture,
} from './fixtures';

async function getAllRootCompetencies(): Promise<
  GraphQlResponse<{ allRootCompetencies: Array<{ id: string }> }>
> {
  return execute<{
    allRootCompetencies: Array<{ id: string }>;
  }>(
    gql`
      query GetAllRootCompetencies {
        allRootCompetencies {
          id
        }
      }
    `,
    {},
  );
}

beforeEach(async () => {
  await prisma.competency.deleteMany();
});

describe('createCompetencyFramework', () => {
  beforeEach(async () => {
    await prisma.competencyFramework.deleteMany();
  });

  test('error on invalid title', async () => {
    const response = await execute<{
      createCompetencyFramework: { data: { title: string } };
    }>(
      gql`
        mutation ($title: String!) {
          createCompetencyFramework(data: { title: $title }) {
            __typename
            ... on UserError {
              code
              path
            }
          }
        }
      `,
      {
        variables: {
          title: '  ',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.createCompetencyFramework.__typename',
      'InputError',
    );
    expect(response.data.createCompetencyFramework).toMatchObject({
      code: 'valueNotValid',
      path: ['title'],
    });
  });

  test('error on duplicate title with same locale', async () => {
    await createCompetencyFrameworkFixture({
      title: 'Hello Framework!',
      language: Language.EN,
    });
    const response = await execute<{
      createCompetencyFramework: { data: { title: string } };
    }>(
      gql`
        mutation ($title: String!) {
          createCompetencyFramework(data: { title: $title }) {
            __typename
            ... on UserError {
              code
              path
            }
          }
        }
      `,
      {
        spec: { locale: 'en' },
        variables: { title: 'Hello Framework!' },
      },
    );
    expect(response).toHaveProperty(
      'data.createCompetencyFramework.__typename',
      'InputError',
    );
    expect(response).toHaveProperty(
      'data.createCompetencyFramework.code',
      'valueNotUnique',
    );
    expect(response).toHaveProperty('data.createCompetencyFramework.path', [
      'title',
    ]);
  });

  test('no error on duplicate title with different locale', async () => {
    await createCompetencyFrameworkFixture({
      title: 'Hello Framework!',
      language: Language.EN,
    });
    const response = await execute<{
      createCompetencyFramework: { data: { title: string } };
    }>(
      gql`
        mutation ($title: String!) {
          createCompetencyFramework(data: { title: $title }) {
            ... on MutationCreateCompetencyFrameworkSuccess {
              data {
                title
              }
            }
          }
        }
      `,
      {
        spec: { locale: 'nl' },
        variables: { title: 'Hello Framework!' },
      },
    );

    expect(response).toHaveProperty('data.createCompetencyFramework.data');
  });

  test('create competency framework in user locale', async () => {
    await createCompetencyFrameworkFixture({
      title: 'Hello Framework!',
      language: Language.EN,
    });
    const response = await execute<{
      createCompetencyFramework: { data: { title: string } };
    }>(
      gql`
        mutation ($title: String!) {
          createCompetencyFramework(data: { title: $title }) {
            ... on MutationCreateCompetencyFrameworkSuccess {
              data {
                title
              }
            }
          }
        }
      `,
      {
        spec: { locale: 'nl' },
        variables: { title: 'Hello Framework!' },
      },
    );
    expect(response).toHaveProperty('data.createCompetencyFramework.data');
  });
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
            ... on UserError {
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

  test('error on framework not found', async () => {
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
            __typename
            ... on UserError {
              code
              path
            }
          }
        }
      `,
      {
        variables: {
          frameworkId: 'non-existing-framework-id',
          title: 'Test title',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.createRootCompetency.__typename',
      'NotFoundError',
    );
    expect(response.data.createRootCompetency).toMatchObject({
      code: 'AE404',
      path: ['frameworkId'],
    });
  });

  test('error on duplicate title with same locale', async () => {
    const person = await createUserFixture();
    await createCompetencyFixture({
      title: 'Hello Root!',
      language: Language.EN,
      frameworkId: framework.id,
    });
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
            __typename
            ... on UserError {
              code
              path
            }
          }
        }
      `,
      {
        spec: { locale: 'en', userId: person.id },
        variables: { frameworkId: framework.id, title: 'Hello Root!' },
      },
    );
    expect(response).toHaveProperty(
      'data.createRootCompetency.__typename',
      'InputError',
    );
    expect(response).toHaveProperty(
      'data.createRootCompetency.code',
      'valueNotUnique',
    );
    expect(response).toHaveProperty('data.createRootCompetency.path', [
      'title',
    ]);
  });

  test('no error on duplicate title with different locale', async () => {
    const user = await createUserFixture();
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
            ... on MutationCreateRootCompetencySuccess {
              data {
                id
              }
            }
          }
        }
      `,
      {
        spec: { locale: 'nl', userId: user.id },
        variables: { frameworkId: framework.id, title: 'Hello Root!' },
      },
    );
    expect(response).toHaveProperty('data.createRootCompetency.data');
  });

  test('should create competency in user locale', async () => {
    const user = await createUserFixture();
    const response = await execute<{
      createRootCompetency: { data: { id: string } };
    }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
            ... on MutationCreateRootCompetencySuccess {
              data {
                id
              }
            }
          }
        }
      `,
      {
        spec: { locale: 'nl', userId: user.id },
        variables: { frameworkId: framework.id, title: 'Hello World!' },
      },
    );
    expect(response).toHaveProperty('data.createRootCompetency.data.id');
    expect(
      await prisma.competency.findUnique({
        include: { translations: true },
        where: { id: response.data.createRootCompetency.data.id },
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
            ... on UserError {
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
    const user = await createUserFixture();
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
            ... on MutationCreateNestedCompetencySuccess {
              data {
                id
              }
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          parentId: parent2.id,
          title: 'Hello Child!',
        },
      },
    );
    expect(response).toHaveProperty('data.createNestedCompetency.data');
  });

  test('error on parent not found', async () => {
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
            ... on UserError {
              code
              path
            }
          }
        }
      `,
      {
        variables: {
          parentId: 'non-existing-parent-id',
          title: 'Hello Child!',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.createNestedCompetency.__typename',
      'NotFoundError',
    );
    expect(response.data.createNestedCompetency).toMatchObject({
      code: 'AE404',
      path: ['parentId'],
    });
  });

  test('should create nested competency', async () => {
    const user = await createUserFixture();
    const parent = await createCompetencyFixture({ title: 'Parent Title' });
    const response = await execute<{ createNestedCompetency: unknown }>(
      gql`
        mutation ($parentId: ID!, $title: String!) {
          createNestedCompetency(data: { parentId: $parentId, title: $title }) {
            ... on MutationCreateNestedCompetencySuccess {
              data {
                __typename
              }
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          parentId: parent.id,
          title: 'Hello World!',
        },
      },
    );
    expect(response.data).toHaveProperty('createNestedCompetency.data');
    expect(response.data.createNestedCompetency).toHaveProperty(
      'data.__typename',
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
    await createCompetencyFixture({
      title: 'Hello Root!',
      frameworkId: framework.id,
    });
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
            __typename
            ... on UserError {
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

  test('error on framework not found', async () => {
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
            __typename
            ... on UserError {
              code
              path
            }
          }
        }
      `,
      {
        variables: {
          frameworkId: 'non-existing-framework-id',
          title: 'Test title',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.createRootCompetency.__typename',
      'NotFoundError',
    );
    expect(response.data.createRootCompetency).toMatchObject({
      code: 'AE404',
      path: ['frameworkId'],
    });
  });

  test('should create root competency with the same name as a competency from another framework', async () => {
    const user = await createUserFixture();
    const newFramework = await createCompetencyFrameworkFixture({
      title: 'Test framework 2',
      language: Language.EN,
    });
    await createCompetencyFixture({
      title: 'Hello Root!',
      language: Language.EN,
      frameworkId: newFramework.id,
    });
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
            ... on MutationCreateRootCompetencySuccess {
              data {
                __typename
              }
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          frameworkId: framework.id,
          title: 'Hello Root!',
        },
      },
    );
    expect(response.data).toHaveProperty(
      'createRootCompetency.data.__typename',
      'Competency',
    );
  });

  test('should create root competency', async () => {
    const user = await createUserFixture();
    const response = await execute<{ createRootCompetency: unknown }>(
      gql`
        mutation ($frameworkId: ID!, $title: String!) {
          createRootCompetency(
            data: { frameworkId: $frameworkId, title: $title }
          ) {
            ... on MutationCreateRootCompetencySuccess {
              data {
                __typename
              }
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          frameworkId: framework.id,
          title: 'Hello Root!',
        },
      },
    );
    expect(response.data).toHaveProperty(
      'createRootCompetency.data.__typename',
      'Competency',
    );
  });
});

describe('deleteCompetency', () => {
  test('error on competency not found', async () => {
    const user = await createUserFixture();
    const response = await execute<
      { deleteCompetency: { id: string } },
      { id: string }
    >(
      gql`
        mutation ($id: ID!) {
          deleteCompetency(id: $id) {
            __typename
            ... on MutationDeleteCompetencySuccess {
              data {
                id
              }
            }
            ... on UserError {
              code
              message
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: { id: 'non-existing-id' },
      },
    );
    expect(response).toHaveProperty(
      'data.deleteCompetency.__typename',
      'NotFoundError',
    );
    expect(response).toHaveProperty('data.deleteCompetency.code', 'AE404');
  });

  test('should delete competency', async () => {
    const user = await createUserFixture();
    const competency = await createCompetencyFixture();
    const response = await execute<
      { deleteCompetency: { id: string } },
      { id: string }
    >(
      gql`
        mutation ($id: ID!) {
          deleteCompetency(id: $id) {
            ... on MutationDeleteCompetencySuccess {
              data {
                id
              }
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: { id: competency.id },
      },
    );
    expect(response).toHaveProperty(
      'data.deleteCompetency.data.id',
      competency.id,
    );
    expect(
      await prisma.competency.findUnique({ where: { id: competency.id } }),
    ).toBe(null);
  });

  test('should delete competency and all its descendants', async () => {
    const user = await createUserFixture();
    const root = await createCompetencyFixture();
    const parent = await createCompetencyFixture({ parentId: root.id });
    const child = await createCompetencyFixture({ parentId: parent.id });
    await execute<{ deleteCompetency: unknown }>(
      gql`
        mutation ($id: ID!) {
          deleteCompetency(id: $id) {
            ... on MutationDeleteCompetencySuccess {
              data {
                id
              }
            }
          }
        }
      `,
      { spec: { userId: user.id }, variables: { id: root.id } },
    );
    expect(
      await prisma.competency.findUnique({ where: { id: child.id } }),
    ).toBe(null);
  });
});

describe('renameCompetency', () => {
  test('error on competency not found', async () => {
    const user = await createUserFixture();
    const response = await execute<{ renameCompetency: unknown }>(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            __typename
            ... on UserError {
              code
              path
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          id: 'non-existing-id',
          title: 'Test title',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.renameCompetency.__typename',
      'NotFoundError',
    );
    expect(response.data.renameCompetency).toMatchObject({ code: 'AE404' });
  });

  test('error on invalid title', async () => {
    const user = await createUserFixture();

    const competency = await createCompetencyFixture();
    const response = await execute<{ renameCompetency: unknown }>(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            __typename
            ... on UserError {
              code
              path
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
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
            ... on UserError {
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
            ... on UserError {
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
    const user = await createUserFixture();

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
            ... on MutationRenameCompetencySuccess {
              data {
                id
              }
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          id: child2.id,
          title: 'Hello Child 1!',
        },
      },
    );
    expect(response).toHaveProperty('data.renameCompetency.data');
  });

  test('should rename competency', async () => {
    const user = await createUserFixture();
    const competency = await createCompetencyFixture();
    const response = await execute<{ renameCompetency: unknown }>(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            ... on MutationRenameCompetencySuccess {
              data {
                title
              }
            }
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          id: competency.id,
          title: 'Hello Universe!',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.renameCompetency.data.title',
      'Hello Universe!',
    );
  });
});

describe('swapCompetencies', () => {
  test('should swap two competencies', async () => {
    const user = await createUserFixture();
    const competency1 = await createCompetencyFixture({
      title: 'Test competency 1',
    });
    const competency2 = await createCompetencyFixture({
      title: 'Test competency 2',
    });
    expect(competency2.sort).toBeGreaterThan(competency1.sort);
    let response2 = await getAllRootCompetencies();
    expect(response2.errors).toBeUndefined();
    expect(response2).toHaveProperty(
      'data.allRootCompetencies.0.id',
      competency1.id,
    );
    expect(response2).toHaveProperty(
      'data.allRootCompetencies.1.id',
      competency2.id,
    );
    const response = await execute<{ swapCompetencies: unknown }>(
      gql`
        mutation ($leftCompetencyId: ID!, $rightCompetencyId: ID!) {
          swapCompetencies(
            leftCompetencyId: $leftCompetencyId
            rightCompetencyId: $rightCompetencyId
          ) {
            __typename
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          leftCompetencyId: competency1.id,
          rightCompetencyId: competency2.id,
        },
      },
    );
    expect(response).toHaveProperty(
      'data.swapCompetencies.__typename',
      'MutationSwapCompetenciesSuccess',
    );
    response2 = await getAllRootCompetencies();
    expect(response2.errors).toBeUndefined();
    expect(response2).toHaveProperty(
      'data.allRootCompetencies.0.id',
      competency2.id,
    );
    expect(response2).toHaveProperty(
      'data.allRootCompetencies.1.id',
      competency1.id,
    );
  });

  test('should return an `NotFound` error', async () => {
    const user = await createUserFixture();
    const competency1 = await createCompetencyFixture({
      title: 'Test competency 1',
    });
    const response = await execute<{ swapCompetencies: unknown }>(
      gql`
        mutation ($leftCompetencyId: ID!, $rightCompetencyId: ID!) {
          swapCompetencies(
            leftCompetencyId: $leftCompetencyId
            rightCompetencyId: $rightCompetencyId
          ) {
            __typename
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          leftCompetencyId: competency1.id,
          rightCompetencyId: 'some_non_existing_id',
        },
      },
    );
    expect(response).toHaveProperty(
      'data.swapCompetencies.__typename',
      'NotFoundError',
    );
  });

  test('should return an `InputError` error', async () => {
    const user = await createUserFixture();
    const rootCompetency1 = await createCompetencyFixture({
      title: 'Root competency 1',
    });
    const rootCompetency2 = await createCompetencyFixture({
      title: 'Root competency 2',
    });
    const competency1 = await createCompetencyFixture({
      title: 'Test competency 1',
      parentId: rootCompetency1.id,
    });
    const competency2 = await createCompetencyFixture({
      title: 'Test competency 1',
      parentId: rootCompetency2.id,
    });
    const response = await execute<{ swapCompetencies: unknown }>(
      gql`
        mutation ($leftCompetencyId: ID!, $rightCompetencyId: ID!) {
          swapCompetencies(
            leftCompetencyId: $leftCompetencyId
            rightCompetencyId: $rightCompetencyId
          ) {
            __typename
          }
        }
      `,
      {
        spec: { userId: user.id },
        variables: {
          leftCompetencyId: competency1.id,
          rightCompetencyId: competency2.id,
        },
      },
    );
    expect(response).toHaveProperty(
      'data.swapCompetencies.__typename',
      'InputError',
    );
  });
});
