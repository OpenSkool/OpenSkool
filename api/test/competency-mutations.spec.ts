import gql from 'graphql-tag';
import { createMercuriusTestClient } from 'mercurius-integration-testing';
import { beforeEach, describe, expect, test } from 'vitest';

import app from '../src/app';
import { CompetencyService } from '../src/domain';
import { prisma } from '../src/prisma';
import { UserErrorModel } from '../src/schema/types/errors';
import { createClientHeaders, createSpecContext } from './helpers';

beforeEach(async () => {
  await prisma.competency.deleteMany();
});

describe('createCompetency', () => {
  test('error on invalid title', async () => {
    const { clientHeaders } = await createSpecContext();
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { error?: UserErrorModel } },
      { title: string }
    >(
      gql`
        mutation ($title: String!) {
          createCompetency(data: { title: $title }) {
            ... on CreateCompetencyErrorPayload {
              error {
                code
                path
              }
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
    expect(createCompetency.error).toMatchObject({
      code: 'valueNotValid',
      path: ['title'],
    });
  });

  test('error on duplicate title at root', async () => {
    const { clientHeaders, languageCode, userId } = await createSpecContext();
    await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Root!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { error?: UserErrorModel } },
      { title: string }
    >(
      gql`
        mutation ($title: String!) {
          createCompetency(data: { title: $title }) {
            ... on CreateCompetencyErrorPayload {
              error {
                code
                path
              }
            }
          }
        }
      `,
      {
        variables: {
          title: 'Hello Root!',
        },
      },
    );
    expect(createCompetency.error).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('error on duplicate title within same parent', async () => {
    const { clientHeaders, languageCode, userId } = await createSpecContext();

    const parent = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Parent!' },
        },
      },
    });
    await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        parentCompetencyId: parent.id,
        translations: {
          create: { languageCode, title: 'Hello Child!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { error?: UserErrorModel } },
      { parentId: string; title: string }
    >(
      gql`
        mutation ($parentId: ID!, $title: String!) {
          createCompetency(data: { parentId: $parentId, title: $title }) {
            ... on CreateCompetencyErrorPayload {
              error {
                code
                path
              }
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
    expect(createCompetency.error).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('no error on duplicate title not within same parent', async () => {
    const { clientHeaders, languageCode, userId } = await createSpecContext();

    const parent1 = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Parent 1!' },
        },
      },
    });
    const parent2 = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Parent 2!' },
        },
      },
    });
    await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        parentCompetencyId: parent1.id,
        translations: {
          create: { languageCode, title: 'Hello Child!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { competency?: { id: string } } },
      { parentId: string; title: string }
    >(
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
        variables: {
          parentId: parent2.id,
          title: 'Hello Child!',
        },
      },
    );
    expect(createCompetency).not.toHaveProperty('error');
  });

  test('no error on duplicate title with different locale', async () => {
    const { languageCode, userId } = await createSpecContext({ locale: 'en' });
    await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Root!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(createClientHeaders({ locale: 'nl', userId }));
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { error?: UserErrorModel } },
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
        variables: {
          title: 'Hello Root!',
        },
      },
    );
    expect(createCompetency).not.toHaveProperty('error');
    expect(createCompetency).toHaveProperty('competency.id');
  });

  test('should create root competency', async () => {
    const { clientHeaders } = await createSpecContext();

    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { createCompetency },
    } = await client.mutate<
      {
        createCompetency: {
          competency?: { __typename: string };
        };
      },
      { title: string }
    >(
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
      { variables: { title: 'Hello World!' } },
    );
    expect(createCompetency.competency).toHaveProperty(
      '__typename',
      'RootCompetency',
    );
  });

  test('should create nested competency', async () => {
    const { clientHeaders, userId } = await createSpecContext();

    const parentCompetency = await CompetencyService.createCompetency(
      { title: 'Parent Title' },
      { locale: 'en', userId },
    );
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { createCompetency },
    } = await client.mutate<
      {
        createCompetency: {
          competency?: { __typename: string };
        };
      },
      { parentId: string; title: string }
    >(
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
        variables: {
          parentId: parentCompetency.id,
          title: 'Hello World!',
        },
      },
    );
    expect(createCompetency.competency).toHaveProperty(
      '__typename',
      'NestedCompetency',
    );
  });

  test('should create competency in user locale', async () => {
    const { clientHeaders, languageCode } = await createSpecContext({
      locale: 'nl',
    });

    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { createCompetency },
    } = await client.mutate<
      {
        createCompetency: {
          competency: { id: string };
        };
      },
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
      { variables: { title: 'Hello World!' } },
    );
    expect(createCompetency.competency).toHaveProperty('id');
    expect(
      await prisma.competency.findUnique({
        include: { translations: true },
        where: { id: createCompetency.competency.id },
      }),
    ).toMatchObject({
      translations: [
        {
          languageCode,
          title: 'Hello World!',
        },
      ],
    });
  });
});

describe('deleteCompetency', () => {
  test('should delete competency', async () => {
    const { clientHeaders, domainContext } = await createSpecContext();
    const competency = await CompetencyService.createCompetency(
      { title: 'Hello World!' },
      domainContext,
    );
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const deletedCompetency = await client.mutate<
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
      { variables: { id: competency.id } },
    );
    expect(deletedCompetency.data).toHaveProperty(
      'deleteCompetency.id',
      competency.id,
    );
    expect(
      await prisma.competency.findUnique({ where: { id: competency.id } }),
    ).toBe(null);
  });

  test('should delete competency and all its descendants', async () => {
    const { domainContext } = await createSpecContext();
    const competencyRoot = await CompetencyService.createCompetency(
      { title: 'Hello World!' },
      domainContext,
    );
    const competencyParent = await CompetencyService.createCompetency(
      { parentId: competencyRoot.id, title: 'Hello World!' },
      domainContext,
    );
    const competencyLeaf = await CompetencyService.createCompetency(
      { parentId: competencyParent.id, title: 'Hello World!' },
      domainContext,
    );
    const client = createMercuriusTestClient(app);
    await client.mutate<{ deleteCompetency: { id: string } }, { id: string }>(
      gql`
        mutation ($id: ID!) {
          deleteCompetency(id: $id) {
            id
          }
        }
      `,
      { variables: { id: competencyRoot.id } },
    );
    expect(
      await prisma.competency.findUnique({ where: { id: competencyLeaf.id } }),
    ).toBe(null);
  });
});

describe('renameCompetency', () => {
  test('error on invalid title', async () => {
    const { clientHeaders, domainContext } = await createSpecContext();

    const competency = await CompetencyService.createCompetency(
      { title: 'Hello World!' },
      domainContext,
    );
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      { renameCompetency: { error?: UserErrorModel } },
      { id: string; title: string }
    >(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            ... on RenameCompetencyErrorPayload {
              error {
                code
                path
              }
            }
          }
        }
      `,
      {
        variables: {
          id: competency.id,
          title: '  ',
        },
      },
    );
    expect(renameCompetency.error).toMatchObject({
      code: 'valueNotValid',
      path: ['title'],
    });
  });

  test('error on duplicate title at root', async () => {
    const { clientHeaders, languageCode, userId } = await createSpecContext();

    await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Root 1!' },
        },
      },
    });
    const root2 = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Root 2!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      { renameCompetency: { error?: UserErrorModel } },
      { id: string; title: string }
    >(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            ... on RenameCompetencyErrorPayload {
              error {
                code
                path
              }
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
    expect(renameCompetency.error).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('error on duplicate title within same parent', async () => {
    const { clientHeaders, languageCode, userId } = await createSpecContext();

    const parent = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Parent!' },
        },
      },
    });
    await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        parentCompetencyId: parent.id,
        translations: {
          create: { languageCode, title: 'Hello Child 1!' },
        },
      },
    });
    const child2 = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        parentCompetencyId: parent.id,
        translations: {
          create: { languageCode, title: 'Hello Child 2!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      { renameCompetency: { error?: UserErrorModel } },
      { id: string; title: string }
    >(
      gql`
        mutation ($id: ID!, $title: String!) {
          renameCompetency(id: $id, data: { title: $title }) {
            ... on RenameCompetencyErrorPayload {
              error {
                code
                path
              }
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
    expect(renameCompetency.error).toMatchObject({
      code: 'valueNotUnique',
      path: ['title'],
    });
  });

  test('no error on duplicate title not within same parent', async () => {
    const { clientHeaders, languageCode, userId } = await createSpecContext();

    const parent1 = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Parent 1!' },
        },
      },
    });
    await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        parentCompetencyId: parent1.id,
        translations: {
          create: { languageCode, title: 'Hello Child 1!' },
        },
      },
    });
    const parent2 = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello Parent 2!' },
        },
      },
    });
    const child2 = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        parentCompetencyId: parent2.id,
        translations: {
          create: { languageCode, title: 'Hello Child 2!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      { renameCompetency: { error?: UserErrorModel } },
      { id: string; title: string }
    >(
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
        variables: {
          id: child2.id,
          title: 'Hello Child 1!',
        },
      },
    );
    expect(renameCompetency).not.toHaveProperty('error');
  });

  test('should rename competency', async () => {
    const { clientHeaders, domainContext } = await createSpecContext();
    const competency = await CompetencyService.createCompetency(
      { title: 'Hello World!' },
      domainContext,
    );
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      {
        renameCompetency: {
          competency?: { title: string };
        };
      },
      { id: string; title: string }
    >(
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
        variables: {
          id: competency.id,
          title: 'Hello Universe!',
        },
      },
    );
    expect(renameCompetency).toHaveProperty(
      'competency.title',
      'Hello Universe!',
    );
  });
});
