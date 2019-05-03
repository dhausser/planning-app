import React from 'react'
import { Page, Filters, HolidayList } from '../components'

export default function Holidays() {
  // const { absences, isLoading } = useAbsences()
  const absences = []
  const isLoading = false
  return (
    <Page title="Absences">
      <Filters />
      <HolidayList absences={absences} isLoading={isLoading} />
    </Page>
  )
}

// function useAbsences() {
//   const [data, setData] = useState({ absences: [], isLoading: true })
//   useEffect(() => {
//     let ignore = false
//     async function fetchData(resource) {
//       const res = await fetch(`/api/${resource}`)
//       const result = await res.json()
//       if (!ignore) setData({ absences: result, isLoading: false })
//     }
//     fetchData('holidays')
//     return () => {
//       ignore = true
//     }
//   }, [])
//   return data
// }
