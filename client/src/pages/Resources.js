import React, { useState, useContext, useEffect } from 'react'
import ContentWrapper from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import Filters from '../components/Filters'
import ResourceList from '../components/ResourceList'
import { FilterContext } from '../context/FilterContext'
import { Authorization } from '../credentials.json'

export default function Resources() {
  const { teamFilter } = useContext(FilterContext)
  const { resources, isLoading } = useResources()
  return (
    <ContentWrapper>
      <PageTitle>People</PageTitle>
      <Filters />
      <ResourceList
        resources={
          teamFilter
            ? resources.filter(resource => resource.team === teamFilter)
            : resources
        }
        isLoading={isLoading}
      />
    </ContentWrapper>
  )
}

function useResources() {
  const [data, setData] = useState({
    resources: [],
    isLoading: true,
  })
  useEffect(() => {
    let ignore = false
    async function fetchData(resource) {
      const query = `{ resources { key name team } }`
      const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization,
        },
        body: JSON.stringify({ query }),
      })
      const {
        data: { resources },
      } = await res.json()
      if (!ignore) setData({ resources, isLoading: false })
    }
    fetchData('resources')
    return () => {
      ignore = true
    }
  }, [])
  return data
}
