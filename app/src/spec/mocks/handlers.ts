import { graphql } from 'msw';

import {
  MutationCreateCompetencySuccess,
  DeleteCompetencyMutation,
  DeleteCompetencyMutationVariables,
  GetEditCompetencyQuery,
  GetSubCompetenciesQuery,
  MutationCreateCompetencyArgs,
  MutationRenameCompetencyArgs,
  MutationRenameCompetencySuccess,
} from '~/generated/graphql';

// mutations

export default [
  graphql.mutation<
    { createCompetency: MutationCreateCompetencySuccess },
    MutationCreateCompetencyArgs
  >('CreateCompetency', (req, res, ctx) => {
    const { variables } = req;

    return res(
      ctx.data({
        createCompetency: {
          __typename: 'MutationCreateCompetencySuccess',
          data: {
            id: 'cuid',
            competencyFramework: {
              id: '1',
              competencies: [],
              title: 'CanMEDS 2015',
            },
            createdAt: '2022-04-01T00:00:00.000Z',
            createdBy: {} as any,
            title: variables.data.title,
            updatedAt: '2022-04-01T00:00:00.000Z',
            updatedBy: {} as any,
          },
        },
      }),
    );
  }),

  graphql.mutation<DeleteCompetencyMutation, DeleteCompetencyMutationVariables>(
    'deleteCompetency',
    (_, res, ctx) => {
      return res(
        ctx.data({
          deleteCompetency: {
            id: 'cuid',
          },
        }),
      );
    },
  ),

  graphql.mutation<
    { renameCompetency: MutationRenameCompetencySuccess },
    MutationRenameCompetencyArgs
  >('renameCompetency', (req, res, ctx) => {
    const { variables } = req;
    return res(
      ctx.data({
        renameCompetency: {
          __typename: 'MutationRenameCompetencySuccess',
          data: {
            id: 'cuid',
            competencyFramework: {
              id: '1',
              competencies: [],
              title: 'CanMEDS 2015',
            },
            createdAt: '2022-04-01T00:00:00.000Z',
            createdBy: {} as any,
            title: variables.data.title,
            updatedAt: '2022-04-01T00:00:00.000Z',
            updatedBy: {} as any,
          },
        },
      }),
    );
  }),

  // queries

  graphql.query('getEducations', (req, res, ctx) => {
    return res(
      ctx.data({
        allEducations: [
          { __typename: 'Education', id: 'chemistry', title: 'Chemistry' },
          { __typename: 'Education', id: 'informatics', title: 'Informatics' },
          { __typename: 'Education', id: 'medicine', title: 'Medicine' },
        ],
      }),
    );
  }),

  graphql.query<GetEditCompetencyQuery>(
    'getEditCompetency',
    (req, res, ctx) => {
      return res(
        ctx.data({
          __typename: 'Query',
          competency: {
            __typename: 'Competency',
            title: 'Informatics',
          },
        }),
      );
    },
  ),

  graphql.query<GetSubCompetenciesQuery>(
    'getSubCompetencies',
    (req, res, ctx) => {
      return res(
        ctx.data({
          competency: {
            id: 'cuid',
            title: 'custom title',
            parent: {
              title: 'custom title',
              id: 'cuid',
            },
            subCompetencies: [
              {
                id: 'cuid',
                title: 'custom title',
              },
            ],
          },
        }),
      );
    },
  ),
];
