import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import EmptyState from '@atlaskit/empty-state';
import Loading from '../Loading';
import ProjectFilter from './ProjectFilter';
import VersionFilter from './VersionFilter';
import TeamFilter from './TeamFilter';
import { GET_FILTERS } from '../../queries';

export default function Filters() {
  const { data, loading, error } = useQuery(GET_FILTERS);

  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <>
      <ProjectFilter {...data} />
      <VersionFilter {...data} />
      <TeamFilter {...data} />
    </>
  );
}
