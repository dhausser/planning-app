import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import Loading from './Loading'
import Error from './Error'
import TableTree from './TableTree'
import { GET_STORIES } from './queries'

export default props => {
  const { epics, version } = props

  const jql = `
  ${epics.lenght ? `'Epic Link' in (${epics.map(({ id }) => id)}) and ` : ''}
  ${version ? `fixVersion in (${props.version.id}) and ` : ''}
  issuetype=story
  order by key asc`

  const { data, loading, error } = useQuery(GET_STORIES, {
    variables: {
      jql,
      pageSize: 50,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <TableTree {...props} stories={data.issues.issues} />
}
