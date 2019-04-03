import React, { useState, useContext, useEffect } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import ResourceList from '../components/ResourceList';
import { FilterContext } from '../modules/App';

/**
 * TODO: Filter Resources
 */
// const resources = team
//   ? this.context.resources.filter(resource => resource.team === team)
//   : this.context.resources;

export default function Resources() {
  const filterContext = useContext(FilterContext);
  const [fixVersion, setFixVersion] = useState(filterContext.fixVersion);
  const { resources, isLoading } = useResources();
  return (
    <ContentWrapper>
      <PageTitle>People</PageTitle>
      <Filters fixVersion={fixVersion} setFixVersion={setFixVersion} />
      <ResourceList resources={resources} isLoading={isLoading} />
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
