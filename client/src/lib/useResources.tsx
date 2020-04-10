import { useQuery, gql } from '@apollo/client';
import { Resource } from '../types';

const GET_RESOURCES = gql`
  query GetResources($teamId: String) {
    teamId @client @export(as: "teamId")
    resources(teamId: $teamId) {
      key
      displayName
      team
      position
      email
      avatarUrls {
        large
        small
      }
    }
  }
`;

const INSERT_RESOURCE = gql`
  mutation InsertResource(
    $firstname: String!
    $lastname: String!
    $position: String!
    $team: String!
  ) {
    insertResource(
      firstname: $firstname
      lastname: $lastname
      position: $position
      team: $team
    ) {
      key
    }
  }
`;

const UPDATE_RESOURCE = gql`
  mutation UpdateResource(
    $id: ID!
    $firstname: String!
    $lastname: String!
    $email: String!
    $team: String!
  ) {
    updateResource(
      id: $id
      firstname: $firstname
      lastname: $lastname
      email: $email
      team: $team
    ) {
      key
    }
  }
`;

const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id)
  }
`;

function useResources(): Resource[] {
  const { loading, error, data } = useQuery(GET_RESOURCES);
  if (loading || error) return [];
  return Array.isArray(data.resources) ? data.resources : [];
}

export default useResources;
export { GET_RESOURCES, INSERT_RESOURCE, UPDATE_RESOURCE, DELETE_RESOURCE };
