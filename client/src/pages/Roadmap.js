import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks'
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
import ContentWrapper, { Center } from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import { getIcon } from '../components/Icon'
import Filters, { GET_FILTERS } from '../components/Filters'
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
  priority: getIcon[issue.priority],
  status: (
    <Status text={issue.status.name} color={getIcon[issue.status.category]} />
  ),
  children: issue.children
    ? issue.children.map(child => issueReducer(child))
    : [],
})

export default function Roadmap() {
  const {
    data: { version },
    loading: loadingFilters,
    error: errorFilters,
  } = useQuery(GET_FILTERS)

  let jql = `project = ${projectId} AND fixVersion = ${
    version.id
  } AND issuetype = epic`
  const {
    data: { issues: epics },
    loading: loadingEpics,
    error: errorEpics,
  } = useQuery(GET_EPICS, {
    variables: { jql, pageSize: 100 },
  })

  jql = `fixVersion = ${version.id} AND 'Epic Link' in (${epics.issues.map(
    ({ id }) => id,
  )})`
  const {
    loading: loadingChildren,
    error: errorChildren,
    data: { issues: epicChildren },
  } = useQuery(GET_CHILDREN, {
    variables: {
      jql,
      pageSize: 25,
    },
  })

  if (loadingEpics || loadingChildren || loadingFilters)
    return (
      <Center>
        <Spinner size="large" />
      </Center>
    )
  if (errorEpics || errorChildren || errorFilters)
    return (
      <EmptyState
        header="Error"
        description={[errorEpics, errorChildren, errorFilters].map(
          ({ message }) => message,
        )}
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
          <Header width={120}>Type</Header>
          <Header width={450}>Summary</Header>
          <Header width={70}>Priority</Header>
          <Header width={170}>Status</Header>
        </Headers>
        <Rows
          items={epics.issues.map(issue => issueReducer(issue))}
          render={({ key, summary, type, priority, status, children }) => (
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
              <Cell singleLine>{priority}</Cell>
              <Cell singleLine>{status}</Cell>
            </Row>
          )}
        />
      </TableTree>
    </ContentWrapper>
  )
}
