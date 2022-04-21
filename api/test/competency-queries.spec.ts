import { Language } from '@prisma/client';
import gql from 'graphql-tag';
import { beforeEach, describe, expect, test } from 'vitest';

import { prisma } from '../src/prisma';
import { execute } from './client';
import { createCompetencyFixture } from './fixtures';

export async function expectCompetencyWithIdToHaveTitle(
  id: string,
  title: string,
  locale = 'nl',
): Promise<void> {
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
  expect(response).not.toHaveProperty('errors');
  expect(response).toHaveProperty('data.competency.title', title);
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
    await expectCompetencyWithIdToHaveTitle(
      competency.id,
      'Hello World!',
      'en',
    );
  });

  test('get title in default locale with user fallback locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.EN,
      title: 'Hello World!',
    });
    await expectCompetencyWithIdToHaveTitle(
      competency.id,
      'Hello World!',
      'nl',
    );
  });

  test('get title in other locale with user prefered locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    await expectCompetencyWithIdToHaveTitle(
      competency.id,
      'Hallo Wereld!',
      'nl',
    );
  });

  test('get title in other locale with user fallback locale', async () => {
    const competency = await createCompetencyFixture({
      language: Language.NL,
      title: 'Hallo Wereld!',
    });
    await expectCompetencyWithIdToHaveTitle(
      competency.id,
      'Hallo Wereld!',
      'en',
    );
  });
});
