import React from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import Select from '@atlaskit/select';
import { Wrapper } from './ProjectFilter';

export default () => {
  const client = useApolloClient();
  const { data: { statusId } } = useQuery(gql`{ statusId @client }`);

  const options = [
    { value: '2', label: 'Open' },
    { value: '4', label: 'In Progress' },
    { value: '3', label: 'Closed' },
  ];
  const defaultValue = options.find(({ value }) => value === statusId);

  return (
    <Wrapper>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        spacing="compact"
        isClearable
        defaultValue={defaultValue}
        options={options}
        placeholder="Choose a Status"
        onChange={(e) => client.writeQuery({
          query: gql`{ statusId }`,
          data: { statusId: e && e.value },
        })}
      />
    </Wrapper>
  );
};
