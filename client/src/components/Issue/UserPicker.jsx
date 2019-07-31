import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
// import { IntlProvider } from 'react-intl';
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

// const GET_ASSIGNABLE_USERS = gql`
//   query GetAssignableUsers($id: ID!) {
//     assignableUsers(id: $id) {
//       key
//       displayName
//     }
//   }
// `;

const ASSIGN_ISSUE = gql`
  mutation AssignIssue($id: ID!, $key: String) {
    assignIssue(id: $id, key: $key)
  }
`;

function getAvatarUrl(key) {
  return `https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${key}`;
}

function getAssignee({ key, displayName }) {
  if (key == null) return {};
  return {
    id: key,
    name: displayName,
    type: 'user',
    fixed: true,
    avatarUrl: getAvatarUrl(key),
  };
}

function getResource(user) {
  return {
    id: user.key,
    name: user.name,
    type: 'user',
    fixed: true,
    emailLabel: user.team,
    avatarUrl: getAvatarUrl(user.key),
  };
}

function AssignUser({ id, user }) {
  const [assignee, setAssignee] = useState(user);
  const { data, loading, error } = useQuery(GET_RESOURCES, { fetchPolicy: 'cache-first' });
  // const { data, loading, error } = useQuery(GET_ASSIGNABLE_USERS, {
  //   variables: { id: issueKey },
  //   fetchPolicy: 'cache-first',
  // });
  const [assignIssue] = useMutation(ASSIGN_ISSUE);

  if (error) return <p>{error.message}</p>;

  return (
    <UserPicker
      fieldId="example"
      isLoading={loading}
      appearance="compact"
      subtle
      isClearable={false}
      defaultValue={assignee && getAssignee(assignee)}
      // maxOptions="100"
      // options={options}
      options={data.resources && data.resources.map(getResource)}
      // options={data.assignableUsers && data.assignableUsers.map(getAssignee)}
      onChange={(value) => {
        setAssignee(value);
        assignIssue({
          variables: {
            id,
            key: value.id,
          },
        });
      }}
    />
  );
}

AssignUser.propTypes = {
  id: PropTypes.string.isRequired,
  // issueKey: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.objectOf).isRequired,
};

export default AssignUser;
