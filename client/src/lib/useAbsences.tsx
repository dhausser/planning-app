import React, { ReactElement } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Absence } from '../types';

const GET_ABSENCES = gql`
  query getAbsences($id: ID!) {
    absences(id: $id) {
      key
      date
    }
  }
`;

export default function useAbsences(id?: string): Array<Absence> {
  const { loading, error, data } = useQuery(GET_ABSENCES, {
    variables: { id },
  });
  if (loading || error) {
    return [];
  }
  return Array.isArray(data.absences) ? data.absences : [];
}
