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
        subtasks {
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
  }
`

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
                // 1. Check if parent is epic
                epics.issues.forEach(issue => {
                  issue.children = epicChildren.issues
                })
              }

              /**
               * TODO: key for chidren links and row layout formatting
               */

              return (
                <ContentWrapper>
                  <PageTitle>Roadmap</PageTitle>
                  <Filters />
                  <TableTree>
                    <Headers>
                      <Header width={150}>Type</Header>
                      <Header width={800}>Summary</Header>
                      <Header width={100}>Value</Header>
                      <Header width={200}>Status</Header>
                    </Headers>
                    <Rows
                      items={issueReducer(epics.issues)}
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

function issueReducer(issues) {
  return issues.map(issue => ({
    key: issue.key,
    type: getIcon[issue.type],
    summary: issue.summary,
    value: getIcon[issue.priority],
    status: (
      <Status text={issue.status.name} color={getIcon[issue.status.category]} />
    ),
    children:
      issue.children &&
      issue.children.map(child => ({
        type: getIcon[child.type],
        summary: child.summary,
        value: getIcon[child.priority],
        status: (
          <Status
            text={child.status.name}
            color={getIcon[child.status.category]}
          />
        ),
        children: child.subtasks.map(subtask => ({
          type: getIcon[subtask.type],
          summary: subtask.summary,
          value: getIcon[subtask.priority],
          status: (
            <Status
              text={subtask.status.name}
              color={getIcon[subtask.status.category]}
            />
          ),
          children: [],
        })),
      })),
  }))
}
