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

const GET_ASSIGNABLE_USERS = gql`
  query GetAssignableUsers($id: ID!) {
    assignableUsers(id: $id) {
      key
      displayName
    }
  }
`;

const ASSIGN_ISSUE = gql`
  mutation AssignIssue($id: ID!, $key: String) {
    assignIssue(id: $id, key: $key)
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

function AssignUser({ id, issueKey, fields }) {
  const [assignee, setAssignee] = useState(fields.assignee);
  const { data, loading, error } = useQuery(GET_RESOURCES);
  // const users = useQuery(GET_ASSIGNABLE_USERS, { variables: { id: issueKey } });
  const [assignIssue, { error: assignError, assignData }] = useMutation(ASSIGN_ISSUE);

  if (loading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  if (assignError || assignData) {
    console.log(assignError);
    console.log(assignData);
  }

  return (
    <UserPicker
      fieldId="example"
      defaultValue={assignee && getAssignee(assignee)}
      options={data.resources.map(getResource)}
      subtle
      isClearable={false}
      onChange={(value) => {
        console.log(value);
        setAssignee(value);
        assignIssue({
          variables: {
            id,
            key: value.id,
          },
        });
        // if (value) {
        // }
      }}
      // onInputChange={() => {}}
    />
  );
}

AssignUser.propTypes = {
  id: PropTypes.string.isRequired,
  issueKey: PropTypes.string.isRequired,
  fields: PropTypes.objectOf(PropTypes.objectOf).isRequired,
};

export default AssignUser;
