import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
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

const EDIT_ISSUE = gql`
  mutation EditIssue($id: ID!, $value: String!, $type: String!) {
    editIssue(id: $id, value: $value, type: $type)
  }
`;

function getAssignee({ key, displayName, avatarUrls }) {
  if (key == null) return {};
  return {
    id: key,
    name: displayName,
    type: 'user',
    fixed: true,
    avatarUrl: avatarUrls.small,
  };
}

function getResource(user) {
  return {
    id: user.key,
    name: user.name,
    type: 'user',
    fixed: true,
    /**
     * TODO: Replace
     */
    // avatarUrl: `https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${user.key}`,
  };
}

function AssignUser({ id, fields }) {
  const [assignee, setAssignee] = useState(fields.assignee);
  const { data, loading, error } = useQuery(GET_RESOURCES);
  const [editIssue] = useMutation(EDIT_ISSUE);

  if (loading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <UserPicker
      fieldId="example"
      defaultValue={assignee && getAssignee(assignee)}
      options={data.resources.map(getResource)}
      subtle
      onChange={(value) => {
        setAssignee(value);
        if (value) {
          editIssue({
            variables: {
              id,
              value: value.id,
              type: 'assignee',
            },
          });
        }
      }}
      // onInputChange={() => {}}
    />
  );
}

AssignUser.propTypes = {
  id: PropTypes.string.isRequired,
  fields: PropTypes.objectOf(PropTypes.objectOf).isRequired,
};

export default AssignUser;
