import gql from 'graphql-tag';
import { createMercuriusTestClient } from 'mercurius-integration-testing';
import { beforeEach, describe, expect, test } from 'vitest';

import app from '../src/app';
import { prisma } from '../src/prisma';
import { UserErrorModel } from '../src/schema/types/errors';
import { CompetencyService } from '../src/services/module';

beforeEach(async () => {
  await prisma.competency.deleteMany();
});

describe('createCompetency', () => {
  test('error on invalid title', async () => {
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const client = createMercuriusTestClient(app);
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { error?: UserErrorModel } },
      { currentUserId: string; title: string }
    >(
      gql`
        mutation ($currentUserId: ID!, $title: String!) {
          createCompetency(
            currentUserId: $currentUserId
            data: { title: $title }
          ) {
            ... on CreateCompetencyErrorPayload {
              error {
                code
                path
              }
            }
          }
        }
      `,
      { variables: { currentUserId: person.id, title: '  ' } },
    );
    expect(createCompetency.error).toMatchObject({
      code: 'valueInvalid',
      path: ['title'],
    });
  });

  test('error on duplicate title at root', async () => {
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Root!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { error?: UserErrorModel } },
      { currentUserId: string; title: string }
    >(
      gql`
        mutation ($currentUserId: ID!, $title: String!) {
          createCompetency(
            currentUserId: $currentUserId
            data: { title: $title }
          ) {
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
          currentUserId: person.id,
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
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const parent = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Parent!' },
        },
      },
    });
    await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        parentCompetencyId: parent.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Child!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { error?: UserErrorModel } },
      { currentUserId: string; parentId: string; title: string }
    >(
      gql`
        mutation ($currentUserId: ID!, $parentId: ID!, $title: String!) {
          createCompetency(
            currentUserId: $currentUserId
            data: { parentId: $parentId, title: $title }
          ) {
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
          currentUserId: person.id,
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
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const parent1 = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Parent 1!' },
        },
      },
    });
    const parent2 = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Parent 2!' },
        },
      },
    });
    await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        parentCompetencyId: parent1.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Child!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    const {
      data: { createCompetency },
    } = await client.mutate<
      { createCompetency: { competency?: { id: string } } },
      { currentUserId: string; parentId: string; title: string }
    >(
      gql`
        mutation ($currentUserId: ID!, $parentId: ID!, $title: String!) {
          createCompetency(
            currentUserId: $currentUserId
            data: { parentId: $parentId, title: $title }
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
        variables: {
          currentUserId: person.id,
          parentId: parent2.id,
          title: 'Hello Child!',
        },
      },
    );
    expect(createCompetency).not.toHaveProperty('error');
  });

  test('should create root competency', async () => {
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const client = createMercuriusTestClient(app);
    const {
      data: { createCompetency },
    } = await client.mutate<
      {
        createCompetency: {
          competency?: { __typename: string };
        };
      },
      { currentUserId: string; title: string }
    >(
      gql`
        mutation ($currentUserId: ID!, $title: String!) {
          createCompetency(
            currentUserId: $currentUserId
            data: { title: $title }
          ) {
            ... on CreateCompetencySuccessPayload {
              competency {
                __typename
              }
            }
          }
        }
      `,
      { variables: { currentUserId: person.id, title: 'Hello World!' } },
    );
    expect(createCompetency.competency).toHaveProperty(
      '__typename',
      'RootCompetency',
    );
  });

  test('should create nested competency', async () => {
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const parentCompetency = await CompetencyService.createCompetency(
      { title: 'Parent Title' },
      { currentUserId: person.id },
    );
    const client = createMercuriusTestClient(app);
    const {
      data: { createCompetency },
    } = await client.mutate<
      {
        createCompetency: {
          competency?: { __typename: string };
        };
      },
      { currentUserId: string; parentId: string; title: string }
    >(
      gql`
        mutation ($currentUserId: ID!, $parentId: ID!, $title: String!) {
          createCompetency(
            currentUserId: $currentUserId
            data: { parentId: $parentId, title: $title }
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
        variables: {
          currentUserId: person.id,
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
});

describe('deleteCompetency', () => {
  test('should delete competency', async () => {
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const competency = await CompetencyService.createCompetency(
      { title: 'Hello World!' },
      { currentUserId: person.id },
    );
    const client = createMercuriusTestClient(app);
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
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const competencyRoot = await CompetencyService.createCompetency(
      { title: 'Hello World!' },
      { currentUserId: person.id },
    );
    const competencyParent = await CompetencyService.createCompetency(
      { parentId: competencyRoot.id, title: 'Hello World!' },
      { currentUserId: person.id },
    );
    const competencyLeaf = await CompetencyService.createCompetency(
      { parentId: competencyParent.id, title: 'Hello World!' },
      { currentUserId: person.id },
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
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const competency = await CompetencyService.createCompetency(
      { title: 'Hello World!' },
      { currentUserId: person.id },
    );
    const client = createMercuriusTestClient(app);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      { renameCompetency: { error?: UserErrorModel } },
      { currentUserId: string; id: string; title: string }
    >(
      gql`
        mutation ($id: ID!, $currentUserId: ID!, $title: String!) {
          renameCompetency(
            id: $id
            currentUserId: $currentUserId
            data: { title: $title }
          ) {
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
          currentUserId: person.id,
          id: competency.id,
          title: '  ',
        },
      },
    );
    expect(renameCompetency.error).toMatchObject({
      code: 'valueInvalid',
      path: ['title'],
    });
  });

  test('error on duplicate title at root', async () => {
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Root 1!' },
        },
      },
    });
    const root2 = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Root 2!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      { renameCompetency: { error?: UserErrorModel } },
      { currentUserId: string; id: string; title: string }
    >(
      gql`
        mutation ($id: ID!, $currentUserId: ID!, $title: String!) {
          renameCompetency(
            currentUserId: $currentUserId
            id: $id
            data: { title: $title }
          ) {
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
          currentUserId: person.id,
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
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const parent = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Parent!' },
        },
      },
    });
    await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        parentCompetencyId: parent.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Child 1!' },
        },
      },
    });
    const child2 = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        parentCompetencyId: parent.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Child 2!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      { renameCompetency: { error?: UserErrorModel } },
      { currentUserId: string; id: string; title: string }
    >(
      gql`
        mutation ($id: ID!, $currentUserId: ID!, $title: String!) {
          renameCompetency(
            id: $id
            currentUserId: $currentUserId
            data: { title: $title }
          ) {
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
          currentUserId: person.id,
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
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const parent1 = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Parent 1!' },
        },
      },
    });
    await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        parentCompetencyId: parent1.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Child 1!' },
        },
      },
    });
    const parent2 = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Parent 2!' },
        },
      },
    });
    const child2 = await prisma.competency.create({
      data: {
        createdById: person.id,
        updatedById: person.id,
        parentCompetencyId: parent2.id,
        translations: {
          create: { languageCode: 'EN', title: 'Hello Child 2!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      { renameCompetency: { error?: UserErrorModel } },
      { currentUserId: string; id: string; title: string }
    >(
      gql`
        mutation ($id: ID!, $currentUserId: ID!, $title: String!) {
          renameCompetency(
            id: $id
            currentUserId: $currentUserId
            data: { title: $title }
          ) {
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
          currentUserId: person.id,
          id: child2.id,
          title: 'Hello Child 1!',
        },
      },
    );
    expect(renameCompetency).not.toHaveProperty('error');
  });

  test('should rename competency', async () => {
    const person = await prisma.person.create({
      data: { firstName: 'Jos', lastName: 'Vermeulen', role: 'TEACHER' },
      select: { id: true },
    });
    const competency = await CompetencyService.createCompetency(
      { title: 'Hello World!' },
      { currentUserId: person.id },
    );
    const client = createMercuriusTestClient(app);
    const {
      data: { renameCompetency },
    } = await client.mutate<
      {
        renameCompetency: {
          competency?: { title: string };
        };
      },
      { currentUserId: string; id: string; title: string }
    >(
      gql`
        mutation ($id: ID!, $currentUserId: ID!, $title: String!) {
          renameCompetency(
            id: $id
            currentUserId: $currentUserId
            data: { title: $title }
          ) {
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
          currentUserId: person.id,
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
