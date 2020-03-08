import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import UserPicker from '@atlaskit/user-picker';
import EmptyState from '@atlaskit/empty-state';

const Wrapper = styled.div`
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
`;

const GET_RESOURCES = gql`
  query resourceList {
    resources {
      key
      name
      team
    }
  }
`;

/**
 * TODO: Get assignable users - currently blocked by oauth authentication failure
 */
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

export function getResource(user) {
  return {
    id: user.key,
    name: user.name,
    type: 'user',
    fixed: true,
    emailLabel: user.team,
    avatarUrl: getAvatarUrl(user.key),
  };
}

function AssignUser({ id, user, type }) {
  const [assignee, setAssignee] = useState(user);
  const { data, loading, error } = useQuery(GET_RESOURCES, { fetchPolicy: 'cache-first' });
  // const { data, loading, error } = useQuery(GET_ASSIGNABLE_USERS, {
  //   variables: { id: issueKey },
  //   fetchPolicy: 'cache-first',
  // });
  const [assignIssue] = useMutation(ASSIGN_ISSUE);

  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <>
      <h6>{type === 'assignee' ? 'ASSIGNEE' : 'REPORTER'}</h6>
      <Wrapper>
        <UserPicker
          fieldId="example"
          isLoading={loading}
          appearance="compact"
          subtle
          isClearable={false}
          defaultValue={assignee && getAssignee(assignee)}
          // maxOptions="100"
          // options={options}
          options={data && data.resources && data.resources.map(getResource)}
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
      </Wrapper>
    </>
  );
}

AssignUser.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  // issueKey: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.objectOf).isRequired,
};

export default AssignUser;
