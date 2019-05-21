import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import Loading from '../Loading'
import Error from '../Error'
import ProjectFilter from './ProjectFilter'
import VersionFilter from './VersionFilter'
import TeamFilter from './TeamFilter'
import { GET_FILTERS } from '../queries'

export default function Filters(props) {
  const { data, loading, error } = useQuery(GET_FILTERS)

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  const renderProjectFilter = true
  const renderVersionFilter = props.match.path !== '/resources'
  const renderTeamFilter = !['/roadmap', '/resource/:resourceId'].includes(
    props.match.path,
  )

  return (
    <>
      {renderProjectFilter && <ProjectFilter project={data.project} />}
      {renderVersionFilter && (
        <VersionFilter project={data.project} version={data.version} />
      )}
      {renderTeamFilter && <TeamFilter team={data.team} />}
    </>
  )
}
