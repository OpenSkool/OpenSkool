import { graphql } from 'msw';

import {
  DeleteCompetencyMutation,
  DeleteCompetencyMutationVariables,
  GetEditCompetencyQuery,
  GetSubCompetenciesQuery,
  MutationCreateCompetencyArgs,
  MutationCreateCompetencyFrameworkArgs,
  MutationCreateCompetencyFrameworkSuccess,
  MutationCreateNestedCompetencySuccess,
  MutationCreateRootCompetencySuccess,
  MutationRenameCompetencyArgs,
  MutationRenameCompetencySuccess,
} from '~/generated/graphql';

// mutations

export default [
  graphql.mutation<
    { createNestedCompetency: MutationCreateNestedCompetencySuccess },
    MutationCreateCompetencyArgs
  >('CreateNestedCompetency', (req, res, ctx) => {
    const { variables } = req;

    return res(
      ctx.data({
        createNestedCompetency: {
          __typename: 'MutationCreateNestedCompetencySuccess',
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

  graphql.mutation<
    { createRootCompetency: MutationCreateRootCompetencySuccess },
    MutationCreateCompetencyArgs
  >('CreateRootCompetency', (req, res, ctx) => {
    const { variables } = req;

    return res(
      ctx.data({
        createRootCompetency: {
          __typename: 'MutationCreateRootCompetencySuccess',
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

  graphql.mutation<
    { createCompetencyFramework: MutationCreateCompetencyFrameworkSuccess },
    MutationCreateCompetencyFrameworkArgs
  >('CreateCompetencyFramework', (req, res, ctx) => {
    const { variables } = req;

    return res(
      ctx.data({
        createCompetencyFramework: {
          __typename: 'MutationCreateCompetencyFrameworkSuccess',
          data: {
            __typename: 'CompetencyFramework',
            competencies: [],
            id: 'cuid',
            title: variables.data.title,
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
            title: 'Title defined in handlers.ts',
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
