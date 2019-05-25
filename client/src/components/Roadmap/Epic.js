import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import Loading from '../Loading'
import Error from '../Error'
import Story from './Story'
import { GET_FILTERS, GET_ISSUES } from '../queries'

export default () => {
  const {
    data: { project, version },
  } = useQuery(GET_FILTERS)

  const jql = `issuetype=epic\
  ${project ? `AND project=${project.id}` : ''}\
  ${version ? `AND fixVersion=${version.id}` : ''}\
  ORDER BY key ASC`

  const { data, loading, error } = useQuery(GET_ISSUES, {
    variables: {
      jql,
      pageSize: 10,
    },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  return <Story epics={data.issues.issues} />
}
