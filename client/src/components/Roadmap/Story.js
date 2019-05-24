import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import Loading from '../Loading'
import Error from '../Error'
import TableTree from './TableTree'
import { GET_STORIES } from '../queries'

export default props => {
  if (!props.epics.length) return []

  const jql = `'Epic Link' in (\
  ${props.epics.map(({ id }) => id)}) AND fixVersion in (\
  ${props.version ? props.version.id : 'earliestUnreleasedVersion()'}\
  ) ORDER BY key ASC`

  const { data, loading, error } = useQuery(GET_STORIES, {
    variables: {
      jql,
      pageSize: 150,
    },
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <TableTree {...props} stories={data.issues.issues} />
}
