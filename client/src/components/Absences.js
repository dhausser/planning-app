import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import Calendar from '@atlaskit/calendar'
import HolidayList from './HolidayList'
import Error from './Error'
import { GET_ABSENCES } from './queries'

export default function Absences(props) {
  const { data, loading, error } = useQuery(GET_ABSENCES, {
    variables: { id: props.match.params.resourceId },
  })
  const absences = loading || error ? [] : data.absences

  return (
    <>
      <HolidayList absences={absences} isLoading={loading} />
      <Calendar day={0} defaultDisabled={absences} />
      {error && <Error error={error} />}
    </>
  )
}
