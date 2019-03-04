// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const findName = (resources, key) => {
  const resource = resources.find(resource => resource.key === key);
  return resource.name;
}

const Wrapper = styled.div`
  min-width: 600px;
`;

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
      {
        key: 'assignee',
        content: 'Assignee',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
    ],
  };
  if (resources == null) {
    head.cells.splice(-1, 1);
  }
  return head;
};

const createRows = (issues, resources) => {
  const rows = issues.map((issue, index) => ({
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
      {
        content: (
          <Link to={`/view/${issue.assignee}`}>
            {resources ? findName(resources, issue.assignee) : ''}
          </Link>
        ),
      },
    ],
  }));
  if (resources == null) {
    rows.forEach(row => {
      row.cells.splice(-1, 1);
    })
  }
  return rows;
}

export default class extends Component {
  render() {
    const { issues, resources } = this.props;
    const caption = 'List of Gwent Issues';
    const head = createHead(true, resources);
    const rows = createRows(issues, resources);
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
          defaultSortKey="status"
          defaultSortOrder="ASC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      </Wrapper>
    );
  };
}
