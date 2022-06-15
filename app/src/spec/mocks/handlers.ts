import { graphql } from 'msw';

import {
  DeleteCompetencyMutation,
  DeleteCompetencyMutationVariables,
  ManageEditCompetencyQuery,
  ManageCompetencyDetailRouteQuery,
  ManageNestedCompetenciesQuery,
  MutationCreateCompetencyFrameworkArgs,
  MutationCreateCompetencyFrameworkSuccess,
  MutationCreateNestedCompetencyArgs,
  MutationCreateNestedCompetencySuccess,
  MutationCreateRootCompetencyArgs,
  MutationCreateRootCompetencySuccess,
  MutationRenameCompetencyArgs,
  MutationRenameCompetencySuccess,
} from '~/codegen/graphql';

export default [
  // mutations

  graphql.mutation<
    { createNestedCompetency: MutationCreateNestedCompetencySuccess },
    MutationCreateNestedCompetencyArgs
  >('CreateNestedCompetency', (req, res, ctx) => {
    const { variables } = req;

    return res(
      ctx.data({
        createNestedCompetency: {
          __typename: 'MutationCreateNestedCompetencySuccess',
          data: {
            id: 'cuid',
            createdAt: '2022-04-01T00:00:00.000Z',
            createdBy: {} as any,
            framework: {
              id: '1',
              competencies: [],
              title: 'CanMEDS 2015',
            },
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
    MutationCreateRootCompetencyArgs
  >('CreateRootCompetency', (req, res, ctx) => {
    const { variables } = req;

    return res(
      ctx.data({
        createRootCompetency: {
          __typename: 'MutationCreateRootCompetencySuccess',
          data: {
            id: 'cuid',
            createdAt: '2022-04-01T00:00:00.000Z',
            createdBy: {} as any,
            framework: {
              id: '1',
              competencies: [],
              title: 'CanMEDS 2015',
            },
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
            __typename: 'MutationDeleteCompetencySuccess',
            data: {
              id: 'cuid',
            },
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
            createdAt: '2022-04-01T00:00:00.000Z',
            createdBy: {} as any,
            framework: {
              id: '1',
              competencies: [],
              title: 'CanMEDS 2015',
            },
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

  graphql.query<ManageEditCompetencyQuery>(
    'manageEditCompetency',
    (req, res, ctx) => {
      return res(
        ctx.data({
          __typename: 'Query',
          competency: {
            __typename: 'QueryCompetencySuccess',
            data: {
              title: 'Title defined in handlers.ts',
            },
          },
        }),
      );
    },
  ),

  graphql.query<ManageNestedCompetenciesQuery>(
    'manageNestedCompetencies',
    (req, res, ctx) => {
      return res(
        ctx.data({
          __typename: 'Query',
          competency: {
            __typename: 'QueryCompetencySuccess',
            data: {
              subCompetencies: [
                {
                  id: 'cuid',
                  title: 'custom title',
                },
              ],
            },
          },
        }),
      );
    },
  ),

  graphql.query<ManageCompetencyDetailRouteQuery>(
    'manageCompetencyDetailRoute',
    (req, res, ctx) => {
      return res(
        ctx.data({
          __typename: 'Query',
          competency: {
            __typename: 'QueryCompetencySuccess',
            data: {
              parent: {
                title: 'custom title',
                id: 'cuid',
              },
              title: 'custom title',
            },
          },
          competencyFramework: {
            __typename: 'QueryCompetencyFrameworkSuccess',
            data: {
              title: 'Competency Framework Title',
            },
          },
        }),
      );
    },
  ),
];
