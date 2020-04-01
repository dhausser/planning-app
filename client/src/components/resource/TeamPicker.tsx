import React, { FunctionComponent } from 'react';
import { useQuery } from '@apollo/client';
import Spinner from '@atlaskit/spinner';
import EmptyState from '@atlaskit/empty-state';
import Select from '@atlaskit/select';
import { GET_TEAMS } from '../filters/TeamFilter';
import { Team } from './types';

const TeamPicker: FunctionComponent = () => {
  const { loading, error, data } = useQuery(GET_TEAMS);
  const options = data
    && data.teams
    && data.teams.map(({ id }: Team) => ({ label: id, value: id }));

  if (loading || !data) return <Spinner size="small" />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Select
      options={options}
      placeholder="Choose a Team"
      defaultValue={options[0]}
    />
  );
};

export default TeamPicker;
