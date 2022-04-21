import { Language } from '@prisma/client';
import gql from 'graphql-tag';
import { beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute } from './client';
import { createCompetencyFixture } from './fixtures';

export async function hasCompetencyThisTitle(
  id: string,
  title: string,
  locale = 'nl',
): Promise<boolean> {
  const response = await execute<{ competency: { title: string } }>(
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
  return !response.errors && response.data.competency.title === title;
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
    expect(
      await hasCompetencyThisTitle(competency.id, 'Hello World!', 'en'),
    ).toBe(true);
  });

  test('get title in default locale with user fallback locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.EN,
      title: 'Hello World!',
    });
    expect(
      await hasCompetencyThisTitle(competency.id, 'Hello World!', 'nl'),
    ).toBe(true);
  });

  test('get title in other locale with user prefered locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    expect(
      await hasCompetencyThisTitle(competency.id, 'Hallo Wereld!', 'nl'),
    ).toBe(true);
  });

  test('get title in other locale with user fallback locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    expect(
      await hasCompetencyThisTitle(competency.id, 'Hallo Wereld!', 'en'),
    ).toBe(true);
  });
});
