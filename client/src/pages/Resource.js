import React, { useState, useContext, useEffect } from 'react'
import Avatar from '@atlaskit/avatar'
import Calendar from '@atlaskit/calendar'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import ContentWrapper, {
  NameWrapper,
  AvatarWrapper,
  Center,
} from '../components/ContentWrapper'
import IssueList from '../components/IssueList'
import Filters from '../components/Filters'
import PageTitle from '../components/PageTitle'
import HolidayList from '../components/HolidayList'
import { FilterContext } from '../context/FilterContext'
import { useIssues } from './Issues'

export default function Resource(props) {
  const { resourceId } = props.match.params
  const { fixVersion } = useContext(FilterContext)

  const jql = `assignee=${resourceId} AND fixVersion=${fixVersion.id}`
  const query = `{
    issues(jql: "${jql}", pageSize: 10, after: 0) {
      startAt
      maxResults
      total
      issues {
        id
        key
        summary
        type
        priority
        status {
          name
          category
        }
        fixVersions {
          id
          name
        }
        assignee {
          id
          name
        }
      }
    }
  }`

  const { issues, maxResults, total, isLoading } = useIssues(query)
  const absences = useAbsences(resourceId)
  if (isLoading)
    return (
      <Center>
        <Spinner size="large" />
      </Center>
    )
  if (issues === [])
    return (
      <EmptyState
        header="This person doesn't exist"
        description={`The person you are trying to lookup isn't currently recorded in the database.`}
      />
    )
  return (
    <ContentWrapper>
      <PageTitle>
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={resourceId}
              size="large"
              src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${resourceId}`}
            />
          </AvatarWrapper>
          {resourceId}
        </NameWrapper>
      </PageTitle>
      <Filters />
      <a
        href={`https://jira.cdprojektred.com/issues/?jql=assignee=${resourceId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
      <IssueList
        issues={issues}
        maxResults={maxResults}
        total={total}
        isLoading={isLoading}
      />
      <HolidayList absences={absences} isLoading={isLoading} />
      <Calendar day={0} defaultDisabled={absences} />
    </ContentWrapper>
  )
}

function useAbsences(resourceId) {
  const [absences, setAbsences] = useState([])
  useEffect(() => {
    let ignore = false
    // async function fetchAbsences() {
    //   const query = `{ absences(user: ${resourceId}) }`
    //   const res = await fetch('/graphql', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ query }),
    //   })
    //   const result = await res.json()
    //   if (!ignore) setAbsences(result)
    // }
    // fetchAbsences()
    return () => {
      ignore = true
    }
  }, [resourceId])
  return absences
}
