import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Spinner from '@atlaskit/spinner';
import EmptyState from '@atlaskit/empty-state';
import UserPicker from '@atlaskit/user-picker';
import { getResource } from '../Issue/UserPicker';

const GET_ASSIGNABLE_USERS = gql`
  query GetAssignableUsers($project: String) {
    assignableUsers(project: $project) {
      key
      displayName
    }
  }
`;

export default function AssignableUserPicker() {
  const { loading, error, data } = useQuery(GET_ASSIGNABLE_USERS, { variables: { project: 'GWENT' } });

  if (loading || !data) return <Spinner size="small" />;
  if (error) return <EmptyState name={error.name} message={error.message} />;

  return (
    <UserPicker
      fieldId="assignee"
      isLoading={loading}
      options={data && data.resources && data.resources.map(getResource)}
    />
  );
}
