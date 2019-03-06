// @flow
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';
import Avatar from '@atlaskit/avatar';

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const Wrapper = styled.div`
  min-width: 600px;
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
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
    {
      key: 'issues',
      content: 'Issues',
      shouldTruncate: true,
      isSortable: true,
      width: withWidth ? 10 : undefined,
    },
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
                src={`https://api.adorable.io/avatars/24/${encodeURIComponent(
                  resource.key
                )}.png`}
              />
            </AvatarWrapper>
            <Link to={`/view/${resource.key}`}>{resource.name}</Link>
          </NameWrapper>
        ),
      },
      {
        key: createKey(resource.team),
        content: resource.team,
      },
      {
        content: resource.issues.length,
      },
      {
        content: resource.holidays.length,
      },
    ],
  }));

const ResourceList = ({ resources }) => {
  const caption = 'List of Gwent Developers';
  const head = createHead('false');
  const rows = createRows(resources);
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={rows}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={false}
        isFixedSize
        defaultSortKey="issues"
        defaultSortOrder="DESC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />
    </Wrapper>
  );
};

ResourceList.propTypes = {
  resources: PropTypes.array,
};

export default ResourceList;
