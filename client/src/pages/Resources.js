import React, { useState, useEffect } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import ResourceList from '../components/ResourceList';

export default function Resources() {
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

  /**
   * Filter Resources
   */
  // const resources = team
  //   ? this.context.resources.filter(resource => resource.team === team)
  //   : this.context.resources;

  return (
    <ContentWrapper>
      <PageTitle>People</PageTitle>
      <Filters />
      <ResourceList resources={data.resources} isLoading={data.isLoading} />
    </ContentWrapper>
  );
}
