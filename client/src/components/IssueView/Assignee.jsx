import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '@atlaskit/avatar';
import { NameWrapper, AvatarWrapper } from '../Page';
import { host } from '../../config';

function Assignee({ assignee }) {
  return (
    <>
      {assignee ? (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={assignee.name}
              size="small"
              src={`https://${host}/secure/useravatar?ownerId=${assignee.key}`}
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
