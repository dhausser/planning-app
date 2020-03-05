import React from 'react';
import { Link } from '@reach/router';
import Avatar from '@atlaskit/avatar';
import Button, { ButtonGroup } from '@atlaskit/button';
import styled from 'styled-components';

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

export default (resources, setIsEditOpen, setIsDeleteOpen) => resources.map((resource) => ({
  key: resource.key,
  cells: [
    {
      key: createKey(resource.name),
      content: (
        <NameWrapper>
          <Avatar
            name={resource.name}
            size="medium"
            src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${resource.key}`}
          />
          <Link to={`/resource/${resource.key}`}>{resource.name}</Link>
        </NameWrapper>
      ),
    },
    {
      key: createKey(resource.team),
      content: resource.team,
    },
    {
      key: 'actions',
      content: (
        <ButtonGroup>
          <Button appearance="default" onClick={() => setIsEditOpen(true)}>Edit</Button>
          <Button appearance="default" onClick={() => setIsDeleteOpen(true)}>Delete</Button>
        </ButtonGroup>
      ),
    },
  ],
}));
