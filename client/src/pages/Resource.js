import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Avatar from '@atlaskit/avatar'
import Calendar from '@atlaskit/calendar'
import { Page, Loading, Error, IssueList } from '../components'
import { GET_FILTERS } from '../components/Filters'
import { NameWrapper, AvatarWrapper } from '../components/Page'
import HolidayList from '../components/HolidayList'
import { GET_ISSUES } from './Issues'

const GET_RESOURCE = gql`
  query getResourceById($id: ID!) {
    resource(id: $id) {
      key
      name
      team
    }
  }
`

const GET_ABSENCES = gql`
  query absenceList($id: ID!) {
    absences(id: $id) {
      key
      date
    }
  }
`

export default function Resource(props) {
  const { resourceId } = props.match.params
  console.log(resourceId)
  const {
    data: { version },
  } = useQuery(GET_FILTERS)
  const {
    data: { resource },
  } = useQuery(GET_RESOURCE, {
    variables: {
      id: resourceId,
    },
  })
  const {
    data: { issues },
    loading: loadingIssues,
    error: errorIssues,
  } = useQuery(GET_ISSUES, {
    variables: {
      jql: `assignee=${resourceId} AND fixVersion=${version.id}`,
      pageSize: 10,
    },
  })
  const {
    data: { absences },
    loading: loadingAbsences,
    error: errorAbsences,
  } = useQuery(GET_ABSENCES, {
    variables: { id: resourceId },
  })

  if (loadingIssues || loadingAbsences) return <Loading />
  if (errorIssues) return <Error error={errorIssues} />
  if (errorAbsences) return <Error error={errorAbsences} />

  console.log(resource)

  let assignee = {}
  if (resource) {
    assignee = { ...resource }
  } else if (issues.issues.length) {
    assignee = { ...issues.issues[0].assignee }
  } else {
    assignee = {
      key: resourceId,
      name: resourceId,
    }
  }

  const title = (
    <NameWrapper>
      <AvatarWrapper>
        <Avatar
          name={assignee.name}
          size="large"
          src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${
            assignee.key
          }`}
        />
      </AvatarWrapper>
      {assignee.name}
    </NameWrapper>
  )

  return (
    <Page title={title}>
      <p>
        <a
          href={`https://jira.cdprojektred.com/issues/?jql=assignee=${
            assignee.key
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View in Issue Navigator
        </a>
      </p>
      <IssueList
        issues={issues.issues}
        maxResults={issues.maxResults}
        total={issues.total}
        pathname={props.location.pathname}
        isLoading={loadingIssues}
      />
      <HolidayList absences={absences} isLoading={loadingAbsences} />
      <Calendar day={0} defaultDisabled={absences} />
    </Page>
  )
}
