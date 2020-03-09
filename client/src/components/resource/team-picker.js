import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Spinner from '@atlaskit/spinner';
import EmptyState from '@atlaskit/empty-state';
import Select from '@atlaskit/select';
import { GET_TEAMS } from '../filters/team-filter';

export default function TeamPicker({ fieldProps }) {
  const { loading, error, data } = useQuery(GET_TEAMS);
  const options = data && data.teams && data.teams.map(({ id }) => ({ label: id, value: id }));

  if (loading || !data) return <Spinner size="small" />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Select
      {...fieldProps}
      options={options}
      placeholder="Choose a Team"
      defaultValue={options[0]}
    />
  );
}

TeamPicker.propTypes = {
  fieldProps: PropTypes.node.isRequired,
};
