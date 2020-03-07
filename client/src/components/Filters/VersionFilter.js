import React from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import Select from '@atlaskit/select';
import { Wrapper } from './ProjectFilter';

export default () => {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(gql`
    query ($id: ID!, $startAt: Int, $maxResults: Int) {
      projectId @client @export(as: "id")
      versionId @client
      versions(id: $id, startAt: $startAt, maxResults: $maxResults) {
        id
        name
      }
    }
  `);
  let options;
  let defaultValue;

  if (loading || !data) return <Wrapper><Select isLoading /></Wrapper>;
  if (error) return <p>{error.message}</p>;
  if (data && data.versions) {
    options = data.versions.map(({ id, name }) => {
      const option = { value: id, label: name };
      if (id === data.versionId) defaultValue = option;
      return option;
    });
  }

  return (
    <Wrapper>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        spacing="compact"
        isClearable
        value={defaultValue}
        isLoading={loading}
        options={options}
        placeholder="Choose a Version"
        onChange={(e) => client.writeQuery({
          query: gql`{
            versionId
            statusId
          }`,
          data: {
            versionId: e && e.value,
            statusId: null,
          },
        })}
      />
    </Wrapper>
  );
};
