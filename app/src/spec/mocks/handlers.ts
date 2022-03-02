import { graphql } from 'msw';

export default [
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
