import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import DynamicTable from '@atlaskit/dynamic-table';
import EmptyState from '@atlaskit/empty-state';
import Loading from '../Loading';

/**
 * TODO: Using @client fields as variables
 */
const GET_ABSENCES = gql`
  query absenceList($id: ID!, $secret: String, $versionId: Int) {
    secret @client @export(as: "secret")
    versionId @client @export(as: "versionId")
    # visibilityFilter @client {
    #   version {
    #     id @export(as: "versionId")
    #   }
    # }
    absences(id: $id, secret: $secret, versionId: $versionId) {
      key
      date
    }
  }
`;

const head = {
  cells: [
    {
      key: 'date',
      content: 'Date',
      isSortable: true,
    },
    {
      key: 'day',
      content: 'Day',
      isSortable: true,
    },
    {
      key: 'month',
      content: 'Month',
      isSortable: true,
    },
    {
      key: 'year',
      content: 'Year',
      isSortable: true,
    },
  ],
};

const parseRows = (dates = []) => dates.map(date => ({
  key: date,
  cells: [
    {
      key: date,
      content: date.toLocaleDateString(),
    },
    {
      key: date.getDate(),
      content: date.getDate(),
    },
    {
      key: date.getMonth() + 1,
      content: date.getMonth() + 1,
    },
    {
      key: date.getFullYear(),
      content: date.getFullYear(),
    },
  ],
}));


function AbsencesTable({ resourceId }) {
  const { data, loading, error } = useQuery(GET_ABSENCES, {
    variables: { id: resourceId },
    fetchPolicy: 'cache-first',
  });

  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  const dates = data.absences.map(absence => new Date(absence.date));

  return (
    <DynamicTable
      caption="Absences"
      head={head}
      rows={parseRows(dates)}
      // rowsPerPage={10}
      loadingSpinnerSize="large"
      isLoading={loading}
      defaultSortKey="date"
      defaultSortOrder="DESC"
    />
  );
}

AbsencesTable.propTypes = {
  resourceId: PropTypes.string.isRequired,
};

export default AbsencesTable;
