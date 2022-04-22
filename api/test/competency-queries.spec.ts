import { Language } from '@prisma/client';
import gql from 'graphql-tag';
import { beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute, GraphQlResponse } from './client';
import { createCompetencyFixture } from './fixtures';

export async function getCompetencyForIdAndLocale(
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

  test('get title in default locale with user prefered locale', async () => {
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

  test('get title in other locale with user prefered locale', async () => {
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
