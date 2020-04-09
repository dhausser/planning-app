import { useQuery, gql } from '@apollo/client';
import { Team } from '../types';

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
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
