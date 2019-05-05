import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Calendar from '@atlaskit/calendar'
import HolidayList from './HolidayList'
import Error from './Error'
import { GET_ABSENCES } from './queries'

export default function Absences(props) {
  const id = props.match.params.resourceId
  const { data, loading, error } = useQuery(GET_ABSENCES, {
    variables: { id },
  })

  if (error) return <Error error={error} />

  return (
    <>
      <HolidayList
        absences={loading ? [] : data.absences}
        isLoading={loading}
      />
      <Calendar day={0} defaultDisabled={loading ? [] : data.absences} />
    </>
  )
}
