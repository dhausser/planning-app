import React, { ReactElement } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ABSENCES = gql`
  query getAbsences($id: ID!) {
    absences(id: $id) {
      key
      date
    }
  }
`;

export default function useAbsences(id?: string): ReactElement {
  const { loading, error, data } = useQuery(GET_ABSENCES, {
    variables: { id },
  });

  return <div>{JSON.stringify(data)}</div>;
}
