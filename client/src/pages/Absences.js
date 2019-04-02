import React, { useState, useEffect } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import HolidayList from '../components/HolidayList';
// static contextTypes = {
//   isLoading: PropTypes.bool,
//   team: PropTypes.string,
//   resources: PropTypes.array,
// };

export default function Holidays() {
  const [data, setData] = useState({ holidays: [], isLoading: true });

  useEffect(() => {
    let ignore = false;

    async function fetchData(resource) {
      const res = await fetch(`/api/${resource}`);
      const result = await res.json();
      if (!ignore) setData({ holidays: result, isLoading: false });
    }

    fetchData('holidays');
    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Filter Holidays
   */
  // holidays.push = resources
  //   .filter(resource => (team ? resource.team === team : true))
  //   .forEach(resource => holidays.push(...resource.holidays));

  return (
    <ContentWrapper>
      <PageTitle>Absences</PageTitle>
      <Filters />
      <HolidayList holidays={data.holidays} isLoading={data.isLoading} />
    </ContentWrapper>
  );
}
