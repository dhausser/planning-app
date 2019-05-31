import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import DynamicTable from '@atlaskit/dynamic-table'
import Loading from './Loading'
import Error from './Error'
import { GET_ABSENCES } from '../queries'

export default ({ resourceId }) => {
  const { data, loading, error } = useQuery(GET_ABSENCES, {
    variables: { id: resourceId },
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  const dates = data.absences.map(absence => new Date(absence.date))

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
  )
}

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
}

const parseRows = (dates = []) =>
  dates.map(date => ({
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
  }))
