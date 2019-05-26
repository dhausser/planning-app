import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'

import DynamicTable from '@atlaskit/dynamic-table'
import Error from './Error'
import { GET_ABSENCES } from './queries'

export default function AbsencesTable({ resourceId }) {
  const { data, loading, error } = useQuery(GET_ABSENCES, {
    variables: { id: resourceId },
  })

  if (error) return <Error error={error} />

  const absences = loading || error ? [] : data.absences
  const caption = 'List of Absences'
  const head = createHead(false)
  const rows = createRows(absences)

  return (
    <DynamicTable
      caption={caption}
      head={head}
      rows={rows}
      rowsPerPage={10}
      defaultPage={1}
      loadingSpinnerSize="large"
      isLoading={loading}
      isFixedSize
      defaultSortKey="date"
      defaultSortOrder="DESC"
      onSort={() => console.log('onSort')}
      onSetPage={() => console.log('onSetPage')}
    />
  )
}

function createHead(withWidth, resources = null) {
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
  }

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
    )
  }

  return head
}

function createRows(absences, resources = null) {
  return absences.map((holiday, index) => {
    const row = {
      key: `row-${index}-${holiday.key}`,
      cells: [
        {
          content: new Date(holiday.date).toDateString(),
        },
      ],
    }

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
      ]
      row.cells.push(...arr)
    }

    return row
  })
}
