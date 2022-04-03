import gql from 'graphql-tag';
import { createMercuriusTestClient } from 'mercurius-integration-testing';
import { beforeEach, describe, expect, test } from 'vitest';

import app from '../src/app';
import { prisma } from '../src/prisma';
import { createClientHeaders, createSpecContext } from './helpers';

beforeEach(async () => {
  await prisma.competency.deleteMany();
});

describe('competency', () => {
  test('error on competency not found', async () => {
    const client = createMercuriusTestClient(app);
    const response = await client.query<
      { competency: { title: string } },
      { id: string }
    >(
      gql`
        query ($id: ID!) {
          competency(id: $id) {
            title
          }
        }
      `,
      { variables: { id: 'id-does-not-exist' } },
    );
    expect(response).not.toHaveProperty('errors');
    expect(response).toHaveProperty('data.competency', null);
  });

  test('get title in default locale with user prefered locale', async () => {
    const { clientHeaders, languageCode, userId } = await createSpecContext({
      locale: 'en',
    });
    const competency = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello World!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const response = await client.query<
      { competency: { title: string } },
      { id: string }
    >(
      gql`
        query ($id: ID!) {
          competency(id: $id) {
            title
          }
        }
      `,
      { variables: { id: competency.id } },
    );
    expect(response).not.toHaveProperty('errors');
    expect(response).toHaveProperty('data.competency.title', 'Hello World!');
  });

  test('get title in default locale with user fallback locale', async () => {
    const { languageCode, userId } = await createSpecContext({ locale: 'en' });
    const competency = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hello World!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(createClientHeaders({ locale: 'nl', userId }));
    const response = await client.query<
      { competency: { title: string } },
      { id: string }
    >(
      gql`
        query ($id: ID!) {
          competency(id: $id) {
            title
          }
        }
      `,
      { variables: { id: competency.id } },
    );
    expect(response).not.toHaveProperty('errors');
    expect(response).toHaveProperty('data.competency.title', 'Hello World!');
  });

  test('get title in other locale with user prefered locale', async () => {
    const { clientHeaders, languageCode, userId } = await createSpecContext({
      locale: 'nl',
    });
    const competency = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hallo Wereld!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(clientHeaders);
    const response = await client.query<
      { competency: { title: string } },
      { id: string }
    >(
      gql`
        query ($id: ID!) {
          competency(id: $id) {
            title
          }
        }
      `,
      { variables: { id: competency.id } },
    );
    expect(response).not.toHaveProperty('errors');
    expect(response).toHaveProperty('data.competency.title', 'Hallo Wereld!');
  });

  test('get title in other locale with user fallback locale', async () => {
    const { languageCode, userId } = await createSpecContext({ locale: 'nl' });
    const competency = await prisma.competency.create({
      data: {
        createdById: userId,
        updatedById: userId,
        translations: {
          create: { languageCode, title: 'Hallo Wereld!' },
        },
      },
    });
    const client = createMercuriusTestClient(app);
    client.setHeaders(createClientHeaders({ locale: 'en', userId }));
    const response = await client.query<
      { competency: { title: string } },
      { id: string }
    >(
      gql`
        query ($id: ID!) {
          competency(id: $id) {
            title
          }
        }
      `,
      { variables: { id: competency.id } },
    );
    expect(response).toHaveProperty('data.competency.title', 'Hallo Wereld!');
  });
});
