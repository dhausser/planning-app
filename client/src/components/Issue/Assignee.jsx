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

function Assignee({ key, displayName, avatarUrls }) {
  return (
    <NameWrapper>
      <AvatarWrapper>
        <Avatar
          name={displayName}
          size="small"
          src={avatarUrls.small}
        />
      </AvatarWrapper>
      <Link to={`/resource/${key}`}>{displayName}</Link>
    </NameWrapper>

  );
}

Assignee.propTypes = {
  key: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  avatarUrls: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Assignee;
