import { useQuery, gql } from '@apollo/client';
import { Team } from '../types';

export const GET_TEAMS = gql`
  query GetTeams {
    teamId @client
    teams {
      id
      key
      name
    }
  }
`;

export default function TeamFilter(): Team[] {
  const { loading, error, data } = useQuery(GET_TEAMS);

  if (loading || error || !data) {
    return [];
  }

  return data.teams;
}
