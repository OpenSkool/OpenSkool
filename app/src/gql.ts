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
