import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import ResourceList from '../components/ResourceList';
import { FilterContext } from '../context/FilterContext';

const GET_RESOURCES = gql`
  query resourceList {
    resources {
      key
      name
      team
    }
  }
`;

export default function Resources() {
  const { teamFilter } = useContext(FilterContext);
  return (
    <ContentWrapper>
      <PageTitle>People</PageTitle>
      <Filters />
      <Query query={GET_RESOURCES}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading</p>;
          if (error) return <p>Error</p>;
          return (
            <ResourceList
              resources={
                teamFilter
                  ? data.resources.filter(
                      resource => resource.team === teamFilter
                    )
                  : data.resources
              }
              isLoading={loading}
            />
          );
        }}
      </Query>
    </ContentWrapper>
  );
}
