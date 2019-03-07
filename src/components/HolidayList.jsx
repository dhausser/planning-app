// @flow
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DynamicTable from '@atlaskit/dynamic-table';

const Wrapper = styled.div`
  min-width: 600px;
`;

const createHead = (withWidth, resources) => {
  const head = {
    cells: [
      {
        key: 'date',
        content: 'Date',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
    ],
  };

  if (resources != null) {
    head.cells.push(
      {
        key: 'team',
        content: 'Team',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 30 : undefined,
      },
      {
        key: 'name',
        content: 'Name',
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
    );
  }

  return head;
};

const createRows = (holidays, resources) => holidays.map((holiday, index) => {
  const row = {
    key: `row-${index}-${holiday.key}`,
    cells: [
      {
        content: new Date(holiday.date).toDateString(),
      },
    ],
  };

  if (resources != null) {
    const arr = [
      {
        content: resources.find(resource => resource.key === holiday.key)
          .team,
      },
      {
        content: (
          <Link to={`/view/${holiday.key}`}>
            {resources.find(resource => resource.key === holiday.key).name}
          </Link>
        ),
      },
    ];
    row.cells.push(...arr);
  }

  return row;
});

const HolidayList = ({ holidays, resources }) => {
  const caption = 'List of Gwent Absences';
  const head = createHead(false, resources);
  const rows = createRows(holidays, resources);
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={rows}
        rowsPerPage={resources ? 20 : 10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={false}
        isFixedSize
        defaultSortKey="date"
        defaultSortOrder="DESC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />
    </Wrapper>
  );
};

HolidayList.propTypes = {
  holidays: PropTypes.arrayOf([PropTypes.object]).isRequired,
  resources: PropTypes.arrayOf([PropTypes.object]).isRequired,
};

export default HolidayList;
