import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import HolidayList from './HolidayList'
import Error from '../Error'
import { GET_ABSENCES } from '../queries'

export default function Absences(props) {
  const { resourceId } = props.match.params

  const { data, loading, error } = useQuery(GET_ABSENCES, {
    variables: { id: resourceId },
  })

  console.log({ props, data, resourceId })
  const absences = loading || error ? [] : data.absences

  return (
    <>
      <HolidayList absences={absences} isLoading={loading} />
      {error && <Error error={error} />}
    </>
  )
}
