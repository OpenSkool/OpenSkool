import { Language } from '@prisma/client';
import gql from 'graphql-tag';
import { beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute, GraphQlResponse } from './client';
import {
  createCompetencyFixture,
  createCompetencyFrameworkFixture,
} from './fixtures';

async function getCompetencyForIdAndLocale(
  id: string,
  locale: string,
): Promise<GraphQlResponse<{ competency: { title: string } }>> {
  return execute<{ competency: { title: string } }>(
    gql`
      query ($id: ID!) {
        competency(id: $id) {
          title
        }
      }
    `,
    {
      spec: { locale },
      variables: { id },
    },
  );
}

async function getCompetencyFrameworkForIdAndLocale(
  id: string,
  locale: string,
): Promise<GraphQlResponse<{ competencyFramework: { title: string } }>> {
  return execute<{ competencyFramework: { title: string } }>(
    gql`
      query ($id: ID!) {
        competencyFramework(id: $id) {
          title
        }
      }
    `,
    {
      spec: { locale },
      variables: { id },
    },
  );
}

beforeEach(async () => {
  await prisma.competency.deleteMany();
});

describe('competency', () => {
  test('error on competency not found', async () => {
    const response = await execute<
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

  test('get title in default locale with user preferred locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.EN,
      title: 'Hello World!',
    });
    const response = await getCompetencyForIdAndLocale(competency.id, 'en');
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty('data.competency.title', 'Hello World!');
  });

  test('get title in default locale with user fallback locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.EN,
      title: 'Hello World!',
    });
    const response = await getCompetencyForIdAndLocale(competency.id, 'en');
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty('data.competency.title', 'Hello World!');
  });

  test('get title in other locale with user preferred locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    const response = await getCompetencyForIdAndLocale(competency.id, 'nl');
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty('data.competency.title', 'Hallo Wereld!');
  });

  test('get title in other locale with user fallback locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    const response = await getCompetencyForIdAndLocale(competency.id, 'en');
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty('data.competency.title', 'Hallo Wereld!');
  });
});

describe('CompetencyFramework', () => {
  beforeEach(async () => {
    await prisma.competencyFramework.deleteMany();
  });

  test('return an error if the competency framework is not found', async () => {
    const response = await execute<{ competencyFramework: { title: string } }>(
      gql`
        query ($id: ID!) {
          competencyFramework(id: $id) {
            title
          }
        }
      `,
      {
        variables: { id: 'non-existing-id' },
      },
    );
    expect(response).not.toHaveProperty('errors');
    expect(response).toHaveProperty('data.competencyFramework', null);
  });

  test('return a competency framework with the given ID', async () => {
    const competencyFramework = await createCompetencyFrameworkFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    const response = await getCompetencyFrameworkForIdAndLocale(
      competencyFramework.id,
      'nl',
    );
    expect(response).not.toHaveProperty('errors');
    expect(response).toHaveProperty(
      'data.competencyFramework.title',
      'Hallo Wereld!',
    );
  });

  test('get title in default locale with user preferred locale', async () => {
    const competencyFramework = await createCompetencyFrameworkFixture({
      language: Language.EN,
      title: 'Hello World!',
    });
    const response = await getCompetencyFrameworkForIdAndLocale(
      competencyFramework.id,
      'en',
    );
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty(
      'data.competencyFramework.title',
      'Hello World!',
    );
  });

  test('get title in default locale with user fallback locale', async () => {
    const competencyFramework = await createCompetencyFrameworkFixture({
      language: Language.EN,
      title: 'Hello World!',
    });
    const response = await getCompetencyFrameworkForIdAndLocale(
      competencyFramework.id,
      'en',
    );
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty(
      'data.competencyFramework.title',
      'Hello World!',
    );
  });

  test('get title in other locale with user preferred locale', async () => {
    const competencyFramework = await createCompetencyFrameworkFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    const response = await getCompetencyFrameworkForIdAndLocale(
      competencyFramework.id,
      'nl',
    );
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty(
      'data.competencyFramework.title',
      'Hallo Wereld!',
    );
  });

  test('get title in other locale with user fallback locale', async () => {
    const competencyFramework = await createCompetencyFrameworkFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    const response = await getCompetencyFrameworkForIdAndLocale(
      competencyFramework.id,
      'en',
    );
    expect(response.errors).toBeUndefined();
    expect(response).toHaveProperty(
      'data.competencyFramework.title',
      'Hallo Wereld!',
    );
  });
});
