import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '@atlaskit/avatar';

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

function Assignee({ assignee }) {
  return (
    <>
      {assignee ? (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={assignee.name}
              size="small"
              src={`https://${process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${assignee.key}`}
            />
          </AvatarWrapper>
          <Link to={`/resource/${assignee.key}`}>{assignee.name}</Link>
        </NameWrapper>
      ) : (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar name="Unassigned" size="large" />
          </AvatarWrapper>
        Unassigned
        </NameWrapper>
      )}
    </>
  );
}

Assignee.propTypes = {
  assignee: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Assignee;
