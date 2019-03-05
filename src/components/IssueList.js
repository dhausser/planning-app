// @flow
import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';

const Wrapper = styled.div`
  min-width: 600px;
`;

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const findName = (resources, key) => {
  const resource = resources.find(resource => resource.key === key);
  return resource.name;
}

const createHead = (withWidth, resources) => {
  const head = {
    cells: [
      {
        key: 'key',
        content: 'Key',
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
      {
        key: 'summary',
        content: 'Summary',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 30 : undefined,
      },
      {
        key: 'status',
        content: 'Status',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
    ],
  };

  (resources != null) && head.cells.push({
    key: 'assignee',
    content: 'Assignee',
    shouldTruncate: true,
    isSortable: true,
    width: withWidth ? 15 : undefined,
  });

  return head;
};

const createRows = (issues, resources) => issues.map((issue, index, name=findName(resources, issue.assignee)) => {
  const row = {
    key: `row-${index}-${issue.key}`,
    cells: [
      {
        key: createKey(issue.key),
        content: issue.key
      },
      {
        key: createKey(issue.summary),
        content: issue.summary,
      },
      {
        content: issue.status,
      },
    ],
  }
  name && row.cells.push({ content: <Link to={`/view/${issue.assignee}`}>{name}</Link> });
});

export default ({ issues, resources }) => {
  const caption = 'List of Gwent Issues';
  return (
    <Wrapper>
      {issues &&
        <DynamicTable
          caption={caption}
          head={createHead(true, resources)}
          rows={createRows(issues, resources)}
          rowsPerPage={resources ? 20 : 10}
          defaultPage={1}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
          defaultSortKey="status"
          defaultSortOrder="ASC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      }
    </Wrapper>
  );
}
