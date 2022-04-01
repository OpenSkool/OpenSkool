export const READ_COMPETENCY_QUERY = gql`
  query getCompetency($id: ID!) {
    competency(id: $id) {
      id
      title
      ... on NestedCompetency {
        parent {
          id
        }
      }
    }
  }
`;
