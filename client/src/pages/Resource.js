import React, { Fragment, useContext } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
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
import { FilterContext } from '../components/App'
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
  const { fixVersion } = useContext(FilterContext)
  const { resourceId } = props.match.params

  return (
    <ContentWrapper>
      <Query
        query={GET_ISSUES}
        variables={{
          jql: `assignee=${resourceId} AND fixVersion=${fixVersion.id}`,
          pageSize: 10,
        }}
      >
        {({ data, loading, error }) => {
          if (loading)
            return (
              <Center>
                <Spinner size="large" />
              </Center>
            )
          if (error)
            return <EmptyState header="Error" description={error.message} />

          const {
            issues: { issues },
          } = data
          const { assignee } = issues[0]
          return (
            <Fragment>
              <PageTitle>
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
              </PageTitle>
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
                issues={issues}
                maxResults={data.issues.maxResults}
                total={data.issues.total}
                pathname={props.location.pathname}
                isLoading={loading}
              />
            </Fragment>
          )
        }}
      </Query>
      <Query query={GET_ABSENCES} variables={{ id: resourceId }}>
        {({ data, loading, error }) => {
          if (loading)
            return (
              <Center>
                <Spinner size="large" />
              </Center>
            )
          if (error) return <p>Error</p>
          return (
            <Fragment>
              <HolidayList absences={data.absences} isLoading={loading} />
              <Calendar day={0} defaultDisabled={data.absences} />
            </Fragment>
          )
        }}
      </Query>
    </ContentWrapper>
  )
}
