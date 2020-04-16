import React, { FunctionComponent } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme';
import UserPicker from '@atlaskit/user-picker';
import EmptyState from '@atlaskit/empty-state';
import { Resource } from '../../types';

// const GET_RESOURCES = gql`
//   query resourceList {
//     resources {
//       key
//       name
//       team
//     }
//   }
// `;

/**
 * TODO: Get assignable users - currently blocked by oauth authentication failure
 */

export const GET_ASSIGNABLE_USERS = gql`
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

interface Props {
  id: string;
  user: Resource;
  type: string;
}

function getAvatarUrl(key: string): string {
  return `https://jira.cdprojektred.com/secure/useravatar?ownerId=${key}`;
}

function getAssignee({ key, name }: Resource): object {
  if (key == null) return {};
  return {
    id: key,
    name,
    type: 'user',
    fixed: true,
    avatarUrl: getAvatarUrl(key),
  };
}

export function getResource(user: Resource): object {
  return {
    id: user.key,
    name: user.name,
    type: 'user',
    fixed: true,
    emailLabel: user.team,
    avatarUrl: getAvatarUrl(user.key),
  };
}

const AssignUser: FunctionComponent<Props> = ({ id, type }) => {
  const { data, loading, error } = useQuery(GET_ASSIGNABLE_USERS, {
    variables: { id },
  });
  const [assignIssue] = useMutation(ASSIGN_ISSUE);

  if (error)
    return <EmptyState header={error.name} description={error.message} />;

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
          options={
            data.assignableUsers && data.assignableUsers.map(getAssignee)
          }
          onChange={(value): void => {
            assignIssue({
              variables: { id: value },
            });
          }}
        />
      </Wrapper>
    </>
  );
};

export default AssignUser;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Wrapper = styled.div`
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
`;
