import { graphql } from 'msw';

import {
  CreateCompetencyPayload,
  MutationCreateCompetencyArgs,
} from '~/generated/graphql';

export default [
  graphql.mutation<
    { createCompetency: CreateCompetencyPayload },
    MutationCreateCompetencyArgs
  >('CreateCompetency', (req, res, ctx) => {
    const { variables } = req;

    return res(
      ctx.data({
        createCompetency: {
          __typename: 'CreateCompetencySuccessPayload',
          competency: {
            createdAt: '2022-04-01T00:00:00.000Z',
            createdBy: {} as any,
            id: 'cuid',
            title: variables.data.title,
            updatedAt: '2022-04-01T00:00:00.000Z',
            updatedBy: {} as any,
          },
        },
      }),
    );
  }),

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
];
