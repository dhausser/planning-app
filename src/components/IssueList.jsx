// @flow
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';
import { Status } from '@atlaskit/status';

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
    ],
  };

  if (resources != null) {
    head.cells.push({
      key: 'assignee',
      content: 'Assignee',
      shouldTruncate: true,
      isSortable: true,
      width: withWidth ? 15 : undefined,
    });
  }

  return head;
};

const createRows = (issues, resources) => issues.map((issue, index) => {
  const row = {
    key: `row-${index}-${issue.key}`,
    cells: [
      {
        content: issue.key,
      },
      {
        content: issue.summary,
      },
      {
        content: <Status text={issue.status} color="yellow" />,
      },
    ],
  };

  if (resources != null) {
    const { name } = resources.find(
      resource => resource.key === issue.assignee,
    );
    row.cells.push({
      content: <Link to={`/view/${issue.assignee}`}>{name}</Link>,
    });
  }

  return row;
});

const HolidayList = ({ issues, resources }) => {
  const caption = 'List of Gwent Issues';
  return (
    <Wrapper>
      {issues && (
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
          defaultSortOrder="DESC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      )}
    </Wrapper>
  );
};

HolidayList.propTypes = {
  issues: PropTypes.arrayOf([PropTypes.object]).isRequired,
  resources: PropTypes.arrayOf([PropTypes.object]).isRequired,
};

export default HolidayList;
