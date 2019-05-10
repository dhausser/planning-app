import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'

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

import { GET_ISSUES, GET_STORIES, GET_FILTERS } from '../lib/queries'
import { projectId } from '../credentials'

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

  return (
    <Query
      query={GET_ISSUES}
      variables={{
        jql: `project = ${projectId} AND fixVersion = ${
          version.id
        } AND issuetype = epic ORDER BY key ASC`,
        pageSize: 10,
      }}
    >
      {({ data: epics, loading: loadingEpics, error: errorEpics }) => {
        if (loadingEpics) return <Loading />
        if (errorEpics) return <Error error={errorEpics} />

        let jql = ''
        if (epics.issues.issues.length) {
          jql = `fixVersion = ${
            version.id
          } AND 'Epic Link' in (${epics.issues.issues.map(
            ({ id }) => id,
          )}) ORDER BY key ASC`
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
              data: stories,
              loading: loadingStories,
              error: errorStories,
            }) => {
              if (loadingStories) return <Loading />
              if (errorStories) return <Error error={errorStories} />

              if (epics.issues.issues.length) {
                epics.issues.issues.forEach(issue => {
                  issue.children = []
                  if (stories.issues.issues.length) {
                    stories.issues.issues.forEach(child => {
                      if (child.parent === issue.key) {
                        issue.children.push(child)
                      }
                      return null
                    })
                  }
                })
              }

              const items =
                epics.issues.issues.map(issue => issueReducer(issue)) || []

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
