import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree'
import Spinner from '@atlaskit/spinner'
import EmptyState from '@atlaskit/empty-state'
import { Status } from '@atlaskit/status'
import ContentWrapper from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import { getIcon } from '../components/Icon'
import { FilterContext } from '../context/FilterContext'
import Filters from '../components/Filters'
import { projectId } from '../credentials'

const GET_EPICS = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
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
      }
    }
  }
`

const GET_CHILDREN = gql`
  query issueList($jql: String, $pageSize: Int!) {
    issues(jql: $jql, pageSize: $pageSize) {
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
        children {
          key
          summary
          type
          priority
          status {
            name
            category
          }
        }
        parent
      }
    }
  }
`

const issueReducer = issue => ({
  key: issue.key,
  type: getIcon[issue.type],
  summary: issue.summary,
  value: getIcon[issue.priority],
  status: (
    <Status text={issue.status.name} color={getIcon[issue.status.category]} />
  ),
  children: issue.children
    ? issue.children.map(child => issueReducer(child))
    : [],
})

export default function Roadmap() {
  const { fixVersion } = useContext(FilterContext)

  const epicsJql = `project = ${projectId} AND fixVersion = ${
    fixVersion.id
  } AND issuetype = epic`

  return (
    <Query query={GET_EPICS} variables={{ jql: epicsJql, pageSize: 100 }}>
      {({
        loading: loadingEpics,
        error: errorEpics,
        data: { issues: epics },
      }) => {
        if (loadingEpics) return <Spinner />
        if (errorEpics)
          return <EmptyState header="Fail" description={errorEpics.message} />

        return (
          <Query
            query={GET_CHILDREN}
            variables={{
              jql: `fixVersion = ${
                fixVersion.id
              } AND 'Epic Link' in (${epics.issues.map(({ id }) => id)})`,
              pageSize: 25,
            }}
          >
            {({
              loading: loadingChildren,
              error: errorChildren,
              data: { issues: epicChildren },
            }) => {
              if (loadingChildren) return <Spinner />
              if (errorChildren)
                return (
                  <EmptyState
                    header="Fail"
                    description={errorChildren.message}
                  />
                )

              if (epics.issues.length) {
                epics.issues.forEach(issue => {
                  issue.children = []
                  epicChildren.issues.forEach(child => {
                    if (child.parent === issue.key) {
                      issue.children.push(child)
                    }
                    return null
                  })
                })
              }

              return (
                <ContentWrapper>
                  <PageTitle>Roadmap</PageTitle>
                  <Filters />
                  <TableTree>
                    <Headers>
                      <Header>Type</Header>
                      <Header>Summary</Header>
                      <Header>Value</Header>
                      <Header>Status</Header>
                    </Headers>
                    <Rows
                      items={epics.issues.map(issue => issueReducer(issue))}
                      render={({
                        key,
                        summary,
                        type,
                        value,
                        status,
                        children,
                      }) => (
                        <Row
                          expandLabel="Expand"
                          collapseLabel="Collapse"
                          itemId={key}
                          items={children}
                          hasChildren={children && children.length > 0}
                        >
                          <Cell singleLine>{type}</Cell>
                          <Cell singleLine>
                            {<Link to={`/issue/${key}`}>{summary}</Link>}
                          </Cell>
                          <Cell singleLine>{value}</Cell>
                          <Cell singleLine>{status}</Cell>
                        </Row>
                      )}
                    />
                  </TableTree>
                </ContentWrapper>
              )
            }}
          </Query>
        )
      }}
    </Query>
  )
}
