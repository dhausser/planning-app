import React, { useState, useEffect } from 'react'
import ContentWrapper from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import HolidayList from '../components/HolidayList'
import Filters from '../components/Filters'

export default function Holidays() {
  const { absences, isLoading } = useAbsences()
  return (
    <ContentWrapper>
      <PageTitle>Absences</PageTitle>
      <Filters />
      <HolidayList absences={absences} isLoading={isLoading} />
    </ContentWrapper>
  )
}

function useAbsences() {
  const [data, setData] = useState({ absences: [], isLoading: true })
  useEffect(() => {
    let ignore = false
    async function fetchData(resource) {
      const res = await fetch(`/api/${resource}`)
      const result = await res.json()
      if (!ignore) setData({ absences: result, isLoading: false })
    }
    fetchData('holidays')
    return () => {
      ignore = true
    }
  }, [])
  return data
}
