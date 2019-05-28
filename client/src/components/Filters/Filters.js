import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import Loading from '../Loading'
import Error from '../Error'
import ProjectFilter from './ProjectFilter'
import VersionFilter from './VersionFilter'
import TeamFilter from './TeamFilter'
import { GET_FILTERS } from '../../queries'

export default function Filters(props) {
  const { data, loading, error } = useQuery(GET_FILTERS)

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  // const showProject = true
  // const showVersions = props.match.path !== '/resources'
  // const showTeams = !['/roadmap', '/resource/:resourceId'].includes(
  //   props.match.path,
  // )

  return (
    <>
      <ProjectFilter {...data} />
      <VersionFilter {...data} />
      <TeamFilter {...data} />
    </>
  )
}
