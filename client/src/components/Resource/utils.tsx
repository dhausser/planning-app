import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@atlaskit/avatar';
import Button, { ButtonGroup } from '@atlaskit/button';
import styled from 'styled-components';
import TextField from '@atlaskit/textfield';
import { HeadType, RowType } from '@atlaskit/dynamic-table/dist/cjs/types';
import { TeamFilter } from '..';
import { ModalProps } from '../../types';

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

function createKey(input: string): string {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

export const bottomBar: JSX.Element = (
  <div style={{ display: 'flex' }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <TeamFilter />
  </div>
);

export const head: HeadType = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
    },
    {
      key: 'team',
      content: 'Team',
      isSortable: true,
      width: 15,
    },
    {
      key: 'actions',
      content: 'Actions',
      width: 15,
    },
  ],
};

export const rows = ({
  resources,
  setSelection,
  setIsEditOpen,
  setIsDeleteOpen,
}: ModalProps): RowType[] => {
  return resources.map((resource) => ({
    key: resource.key,
    cells: [
      {
        key: createKey(resource.key),
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
            <Button
              appearance="default"
              onClick={(): void | undefined => {
                setSelection(resource);
                setIsEditOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              appearance="default"
              onClick={(): void | undefined => {
                setSelection(resource);
                setIsDeleteOpen(true);
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        ),
      },
    ],
  }));
};
