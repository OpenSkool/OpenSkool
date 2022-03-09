import gql from 'graphql-tag';
import { createMercuriusTestClient } from 'mercurius-integration-testing';
import { describe, expect, test } from 'vitest';

import app from '../src/app';
import { NexusGenFieldTypes } from '../src/generated/nexus';
import { prisma } from '../src/prisma';
import { CompetencyService } from '../src/services/module';

describe('CreateCompetency', () => {
  test('should trim leading and trailing whitespace', async () => {
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
          competency?: Pick<NexusGenFieldTypes['Competency'], 'id' | 'title'>;
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
                id
                title
              }
            }
          }
        }
      `,
      { variables: { currentUserId: person.id, title: '  Hello World!  ' } },
    );
    expect(createCompetency.competency).toMatchObject({
      title: 'Hello World!',
    });
  });

  test('should trim excessive spacing to single spacing', async () => {
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
          competency?: Pick<NexusGenFieldTypes['Competency'], 'id' | 'title'>;
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
                id
                title
              }
            }
          }
        }
      `,
      {
        variables: {
          currentUserId: person.id,
          title: 'Hello  Dear     World!',
        },
      },
    );
    expect(createCompetency.competency).toMatchObject({
      title: 'Hello Dear World!',
    });
  });

  test('should remove control and zero width characters', async () => {
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
          competency?: Pick<NexusGenFieldTypes['Competency'], 'id' | 'title'>;
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
                id
                title
              }
            }
          }
        }
      `,
      {
        variables: {
          currentUserId: person.id,
          title: '\uFEFF \u0000Hello\u001F \u200BWorld\u200D! \u200B',
        },
      },
    );
    expect(createCompetency.competency).toMatchObject({
      title: 'Hello World!',
    });
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
