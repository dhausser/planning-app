import React from 'react';
import { Link } from 'react-router';
import { arrayOf, shape, string, number, bool } from 'prop-types';
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
      }
    );
  }

  return head;
};

const createRows = (absences, resources) =>
  absences.map((holiday, index) => {
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
            <Link to={`/resource/${holiday.key}`}>
              {resources.find(resource => resource.key === holiday.key).name}
            </Link>
          ),
        },
      ];
      row.cells.push(...arr);
    }

    return row;
  });

export default function HolidayList({ absences, resources, isLoading }) {
  const caption = 'List of Absences';
  const head = createHead(false, resources);
  const rows = createRows(absences, resources);
  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={rows}
        rowsPerPage={resources ? 20 : 10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isLoading}
        isFixedSize
        defaultSortKey="date"
        defaultSortOrder="DESC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />
    </Wrapper>
  );
}

HolidayList.propTypes = {
  absences: arrayOf(
    shape({
      key: string,
      date: string,
      count: number,
    })
  ).isRequired,
  resources: arrayOf(
    shape({
      key: string,
      name: string,
    })
  ),
  isLoading: bool,
};
