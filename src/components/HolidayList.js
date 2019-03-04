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

const findTeam = (resources, key) => {
  const resource = resources.find(resource => resource.key === key);
  return resource.team;
}

const dateString = (string) => new Date(string).toDateString();

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
    ],
  };
  if (resources == null) {
    head.cells.splice(-1, 2);
  }
  return head;
};

const createRows = (holidays, resources) => {
  const rows = holidays.map((holiday, index) => ({
    key: `row-${index}-${holiday.key}`,
    cells: [
      {
        key: createKey(holiday.date),
        content: dateString(holiday.date),
      },
      {
        key: createKey(holiday.team),
        content: resources ? findTeam(resources, holiday.key) : '',
      },
      {
        content: (
          <Link to={`/view/${holiday.key}`}>
            {resources ? findName(resources, holiday.key) : ''}
          </Link>
        ),
      },
    ],
  }));
  if (resources == null) {
    rows.forEach(row => {
      row.cells.splice(-1, 2);
    })
  }
  return rows;
}

export default class extends Component {
  render() {
    const { holidays, resources } = this.props;
    const caption = 'List of Gwent Absences';
    const head = createHead(false, resources);
    const rows = createRows(holidays, resources);
    return (
      <Wrapper>
        <DynamicTable
          caption={caption}
          head={head}
          rows={rows}
          rowsPerPage={resources ? 10 : 10}
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
}
