import React, { FunctionComponent } from 'react';
import { useQuery } from '@apollo/client';
import Spinner from '@atlaskit/spinner';
import EmptyState from '@atlaskit/empty-state';
import UserPicker from '@atlaskit/user-picker';
import { getResource, GET_ASSIGNABLE_USERS } from '../Issue/UserPicker';

const AssignableUserPicker: FunctionComponent = () => {
  const { loading, error, data } = useQuery(GET_ASSIGNABLE_USERS, {
    variables: { project: 'GWENT' },
  });

  if (loading || !data) return <Spinner size="small" />;
  if (error) {
    return <EmptyState header={error.name} description={error.message} />;
  }

  return (
    <UserPicker
      fieldId="assignee"
      isLoading={loading}
      options={data && data.resources && data.resources.map(getResource)}
    />
  );
};

export default AssignableUserPicker;
