import gql from 'graphql-tag';
import { createMercuriusTestClient } from 'mercurius-integration-testing';
import { describe, expect, test } from 'vitest';

import app from '../src/app';
import { NexusGenFieldTypes } from '../src/generated/nexus';
import { prisma } from '../src/prisma';
import { CompetencyService } from '../src/services/module';

describe('createCompetency', () => {
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
            currentUserId: $currentUserId
            id: $id
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
