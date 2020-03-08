import React from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import Select from '@atlaskit/select';
import EmptyState from '@atlaskit/empty-state';

export default () => {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(gql`{
    projectId @client
    projects {
      id
      name
    }
  }`);
  let options = [];
  let defaultValue;

  if (error) return <EmptyState header={error.name} description={error.message} />;
  if (data && data.projects) {
    options = data.projects.map(({ id, name }) => {
      const option = { value: id, label: name };
      if (id === data.projectId) defaultValue = option;
      return option;
    });
  }

  return (
    <Wrapper>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        spacing="compact"
        value={defaultValue}
        isLoading={loading}
        options={options}
        placeholder="Choose a Project"
        onChange={(e) => client.writeQuery({
          query: gql`{
            projectId
            versionId
          }`,
          data: {
            projectId: e && e.value,
            versionId: null,
          },
        })}
      />
    </Wrapper>
  );
};

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

export const Wrapper = styled.div`
flex-basis: 180px;
margin-right: 10px;
 `;
