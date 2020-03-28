import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import Avatar from '@atlaskit/avatar';
import { NamePlateProps } from './types';

const GET_ASSIGNEE = gql`
  query Assignee($id: ID!) {
    user(id: $id) {
      displayName
      avatarUrls {
        large
      }
    }
  }
`;

const Nameplate: FunctionComponent<NamePlateProps> = ({ id }) => {
  const { loading, error, data } = useQuery(GET_ASSIGNEE, {
    variables: { id },
  });

  if (loading || error) return <NameWrapper>Unknown user</NameWrapper>;

  return (
    <NameWrapper>
      <AvatarWrapper>
        <Avatar
          name={data.user.displayName}
          size="large"
          src={data.user.avatarUrls.large}
        />
      </AvatarWrapper>
      {data.user.displayName}
    </NameWrapper>
  );
};

export default Nameplate;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;
