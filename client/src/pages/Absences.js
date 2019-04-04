import React, { useState, useContext, useEffect } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import HolidayList from '../components/HolidayList';
import FilterContext from '../context/FilterContext';

/**
 * TODO: Filter Holidays
 */
// holidays.push = resources
//   .filter(resource => (team ? resource.team === team : true))
//   .forEach(resource => holidays.push(...resource.holidays));

export default function Holidays() {
  const filterContext = useContext(FilterContext);
  const [fixVersion, setFixVersion] = useState(filterContext.fixVersion);
  const { absences, isLoading } = useAbsences();
  return (
    <ContentWrapper>
      <PageTitle>Absences</PageTitle>
      <Filters fixVersion={fixVersion} setFixVersion={setFixVersion} />
      <HolidayList absences={absences} isLoading={isLoading} />
    </ContentWrapper>
  );
}

function useAbsences() {
  const [data, setData] = useState({ absences: [], isLoading: true });
  useEffect(() => {
    let ignore = false;
    async function fetchData(resource) {
      const res = await fetch(`/api/${resource}`);
      const result = await res.json();
      if (!ignore) setData({ absences: result, isLoading: false });
    }
    fetchData('holidays');
    return () => {
      ignore = true;
    };
  }, []);
  return data;
}
