import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo-hooks';
import UserPicker from '@atlaskit/user-picker';
import { host } from '../../config';
import { GET_RESOURCES } from '../../queries';

function reducer(user) {
  return {
    id: user.key,
    name: user.name,
    type: 'user',
    fixed: true,
    avatarUrl: `https://${host}/secure/useravatar?ownerId=${user.key}`,
  };
}

function AssignUser({ assignee }) {
  const { data, loading, error } = useQuery(GET_RESOURCES, {
    fetchPolicy: 'cache-first',
  });

  if (loading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  const defaultValue = reducer(assignee);
  const options = data.resources.map(resource => reducer(resource)).sort();

  return (
    <UserPicker
      fieldId="example"
      defaultValue={defaultValue}
      options={options}
      onChange={() => { }}
      onInputChange={() => { }}
    />
  );
}

AssignUser.propTypes = {
  assignee: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default AssignUser;
