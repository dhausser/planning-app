import React from 'react';
import { Link } from 'react-router';
import { arrayOf, shape, string, bool } from 'prop-types';
import styled from 'styled-components';

import DynamicTable from '@atlaskit/dynamic-table';
import Avatar from '@atlaskit/avatar';
import { NameWrapper, AvatarWrapper } from './ContentWrapper';

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const Wrapper = styled.div`
  min-width: 600px;
`;

const createHead = withWidth => ({
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
      width: withWidth ? 25 : undefined,
    },
    {
      key: 'team',
      content: 'Team',
      shouldTruncate: true,
      isSortable: true,
      width: withWidth ? 15 : undefined,
    },
    /**
     * TODO: Get issues count by assignee
     */
    // {
    //   key: 'issues',
    //   content: 'Issues',
    //   shouldTruncate: true,
    //   isSortable: true,
    //   width: withWidth ? 10 : undefined,
    // },
    {
      key: 'absences',
      content: 'Absences',
      shouldTruncate: true,
      isSortable: true,
      width: withWidth ? 10 : undefined,
    },
  ],
});

const createRows = resources =>
  resources.map((resource, index) => ({
    key: `row-${index}-${resource.name}`,
    cells: [
      {
        key: createKey(resource.name),
        content: (
          <NameWrapper>
            <AvatarWrapper>
              <Avatar
                name={resource.name}
                size="medium"
                src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${encodeURIComponent(
                  resource.key
                )}`}
              />
            </AvatarWrapper>
            <Link to={`/resource/${resource.key}`}>{resource.name}</Link>
          </NameWrapper>
        ),
      },
      {
        key: createKey(resource.team),
        content: resource.team,
      },
      // {
      //   key: resource.issues.length + 1,
      //   content: resource.issues.length,
      // },
      {
        key: resource.holidays.length + 1,
        content: resource.holidays.length,
      },
    ],
  }));

export default function ResourceList({ resources, isLoading }) {
  const caption = `Listing ${resources.length} developers`;
  const head = createHead('false');
  const rows = createRows(resources);
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={rows}
        rowsPerPage={20}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isLoading}
        isFixedSize
        defaultSortKey="absences"
        defaultSortOrder="DESC"
      />
    </Wrapper>
  );
}

ResourceList.propTypes = {
  resources: arrayOf(
    shape({
      key: string,
      name: string,
    })
  ).isRequired,
  isLoading: bool,
};
