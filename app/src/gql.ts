export const READ_COMPETENCY_QUERY = gql`
  query getCompetency($id: ID!) {
    competency(id: $id) {
      id
      title
      ... on NestedCompetency {
        parentId
      }
    }
  }
`;

export const CREATE_COMPETENCY_QUERY = gql`
  mutation CreateCompetency(
    $currentUserId: ID!
    $data: CreateCompetencyInput!
  ) {
    createCompetency(currentUserId: $currentUserId, data: $data) {
      ... on CreateCompetencyErrorPayload {
        error {
          code
          message
          path
        }
      }
      ... on CreateCompetencySuccessPayload {
        competency {
          id
        }
      }
    }
  }
`;
