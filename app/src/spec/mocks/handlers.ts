import { graphql } from 'msw';

export default [
  graphql.query('getEducations', (req, res, ctx) => {
    return res(
      ctx.data({
        educations: [
          { __typename: 'Education', id: 'chemistry', name: 'Chemistry' },
          { __typename: 'Education', id: 'informatics', name: 'Informatics' },
          { __typename: 'Education', id: 'medicine', name: 'Medicine' },
        ],
      }),
    );
  }),
];
