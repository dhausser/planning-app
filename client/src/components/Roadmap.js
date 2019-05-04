import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree'
import { Status } from '@atlaskit/status'

import Loading from './Loading'
import Error from './Error'
import { getIcon } from './Icon'
import { GET_FILTERS } from './Filters'

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

const GET_STORIES = gql`
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
  } = useQuery(GET_FILTERS)

  /**
   * TODO: Fix page crash on reload, version is undefined
   */
  console.log(version)

  return (
    <Query
      query={GET_EPICS}
      variables={{
        jql: `project = ${projectId} AND fixVersion = ${
          version.id
        } AND issuetype = epic`,
        pageSize: 10,
      }}
    >
      {({
        data: { issues: epics },
        loading: loadingEpics,
        error: errorEpics,
      }) => {
        if (loadingEpics) return <Loading />
        if (errorEpics) return <Error error={errorEpics} />

        let jql = ''
        if (epics.issues.length) {
          jql = `fixVersion = ${
            version.id
          } AND 'Epic Link' in (${epics.issues.map(({ id }) => id)})`
        }

        return (
          <Query
            query={GET_STORIES}
            variables={{
              jql,
              pageSize: 25,
            }}
          >
            {({
              data: { issues: stories },
              loading: loadingStories,
              error: errorStories,
            }) => {
              if (loadingStories) return <Loading />
              if (errorStories) return <Error error={errorStories} />

              if (epics.issues.length) {
                epics.issues.forEach(issue => {
                  issue.children = []
                  if (stories.issues.length) {
                    stories.issues.forEach(child => {
                      if (child.parent === issue.key) {
                        issue.children.push(child)
                      }
                      return null
                    })
                  }
                })
              }

              const items = epics.issues.map(issue => issueReducer(issue)) || []

              return (
                <>
                  <p>
                    <Link to="/">Back to Dashboards</Link>
                  </p>
                  <TableTree>
                    <Headers>
                      <Header width={120}>Type</Header>
                      <Header width={450}>Summary</Header>
                      <Header width={70}>Priority</Header>
                      <Header width={170}>Status</Header>
                    </Headers>
                    <Rows
                      items={items}
                      render={({
                        key,
                        summary,
                        type,
                        priority,
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
                          <Cell singleLine>{priority}</Cell>
                          <Cell singleLine>{status}</Cell>
                        </Row>
                      )}
                    />
                  </TableTree>
                </>
              )
            }}
          </Query>
        )
      }}
    </Query>
  )
}
