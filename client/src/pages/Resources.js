import React, { useState, useContext, useEffect } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import ResourceList from '../components/ResourceList';
import { FilterContext } from '../context/FilterContext';

export default function Resources() {
  const { team } = useContext(FilterContext);
  const { resources, isLoading } = useResources();
  return (
    <ContentWrapper>
      <PageTitle>People</PageTitle>
      <Filters />
      <ResourceList
        resources={
          team
            ? resources.filter(resource => resource.team === team)
            : resources
        }
        isLoading={isLoading}
      />
    </ContentWrapper>
  );
}

function useResources() {
  const [data, setData] = useState({
    resources: [],
    isLoading: true,
  });
  useEffect(() => {
    let ignore = false;
    async function fetchData(resource) {
      const res = await fetch(`/api/${resource}`);
      const result = await res.json();
      if (!ignore) setData({ resources: result, isLoading: false });
    }
    fetchData('resources');
    return () => {
      ignore = true;
    };
  }, []);
  return data;
}
