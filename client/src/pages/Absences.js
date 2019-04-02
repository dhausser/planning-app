import React, { useState, useEffect } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import HolidayList from '../components/HolidayList';

/**
 * TODO: Filter Holidays
 */
// holidays.push = resources
//   .filter(resource => (team ? resource.team === team : true))
//   .forEach(resource => holidays.push(...resource.holidays));

export default function Holidays() {
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

  return (
    <ContentWrapper>
      <PageTitle>Absences</PageTitle>
      <Filters />
      <HolidayList absences={data.absences} isLoading={data.isLoading} />
    </ContentWrapper>
  );
}
