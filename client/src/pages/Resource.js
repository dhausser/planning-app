import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import Avatar from '@atlaskit/avatar'
import Calendar from '@atlaskit/calendar'
import EmptyState from '@atlaskit/empty-state'
import Spinner from '@atlaskit/spinner'
import Page, { NameWrapper, AvatarWrapper, Center } from '../components/Page'
import IssueList from '../components/IssueList'
import Filters, { GET_FILTERS } from '../components/Filters'
import HolidayList from '../components/HolidayList'
import { GET_ISSUES } from './Issues'

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
  const {
    data: { version },
  } = useQuery(GET_FILTERS)
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

  if (loadingIssues || loadingAbsences)
    return (
      <Center>
        <Spinner size="large" />
      </Center>
    )
  if (errorIssues || errorAbsences)
    return (
      <EmptyState
        header="Error"
        description={[errorIssues, errorAbsences].map(({ message }) => message)}
      />
    )

  const { assignee } = issues.issues[0]
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
      <Filters />
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
