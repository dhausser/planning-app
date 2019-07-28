import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import UserPicker from '@atlaskit/user-picker';

const GET_RESOURCES = gql`
  query resourceList {
    resources {
      key
      name
      team
    }
  }
`;

function getAssignee({ key, displayName }) {
  if (key == null) return {};
  return {
    id: key,
    name: displayName,
    type: 'user',
    fixed: true,
    avatarUrl: `https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${key}`,
  };
}

function getResource(user) {
  return {
    id: user.key,
    name: user.name,
    type: 'user',
    fixed: true,
    avatarUrl: `https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${user.key}`,
  };
}

function AssignUser({ assignee }) {
  const { data, loading, error } = useQuery(GET_RESOURCES);

  if (loading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <UserPicker
      fieldId="example"
      defaultValue={assignee && getAssignee(assignee)}
      options={data.resources.map(getResource)}
      subtle
      // onChange={() => {}}
      // onInputChange={() => {}}
    />
  );
}

AssignUser.defaultProps = {
  assignee: {},
};

AssignUser.propTypes = {
  assignee: PropTypes.objectOf(PropTypes.string),
};

export default AssignUser;
