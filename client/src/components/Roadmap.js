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
import Button from '@atlaskit/button'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import Tooltip from '@atlaskit/tooltip'

import { getIcon } from './Issue/Icon'
import Loading from './Loading'
import Error from './Error'

import { hostname } from '../credentials'

import { GET_ISSUES, GET_STORIES, GET_FILTERS } from './queries'

const issueReducer = issue => ({
  key: issue.key,
  summary: issue.summary,
  assignee: issue.assignee ? issue.assignee : { key: '', name: 'Unassigned' },
  type: getIcon[issue.type],
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
    data: { project, version },
  } = useQuery(GET_FILTERS)

  const jql = `issuetype=epic ${
    version ? ` AND fixVersion=${version.id}` : ''
  }${project ? ` AND project=${project.id}` : ''} ORDER BY key ASC`

  return (
    <Query
      query={GET_ISSUES}
      variables={{
        jql,
        pageSize: 10,
      }}
    >
      {({ data: epics, loading: loadingEpics, error: errorEpics }) => {
        if (loadingEpics) return <Loading />
        if (errorEpics) return <Error error={errorEpics} />

        let childrenQuery = ''
        if (epics.issues.issues.length) {
          childrenQuery = `'Epic Link' in (${epics.issues.issues.map(
            ({ id }) => id,
          )})${version ? ` AND fixVersion=${version.id}` : ''} ORDER BY key ASC`
        }

        return (
          <Query
            query={GET_STORIES}
            variables={{
              jql: childrenQuery,
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
                  <TableTree>
                    <Headers>
                      <Header width={120}>Type</Header>
                      <Header width={160}>key</Header>
                      <Header width={500}>Summary</Header>
                      <Header width={200}>Assignee</Header>
                      <Header width={70}>Priority</Header>
                      <Header width={170}>Status</Header>
                      <Header width={80}>Link</Header>
                    </Headers>
                    <Rows
                      items={items}
                      render={({
                        key,
                        summary,
                        type,
                        assignee,
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
                          isExpanded
                        >
                          <Cell singleLine>{type}</Cell>
                          <Cell singleLine>
                            <a
                              href={`https://${hostname}/browse/${key}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {key}
                            </a>
                          </Cell>
                          <Cell singleLine>
                            <Link to={`/issue/${key}`}>{summary}</Link>
                          </Cell>
                          <Cell singleLine>
                            <Link to={`/resource/${assignee.key}`}>
                              {assignee.name}
                            </Link>
                          </Cell>
                          <Cell singleLine>{priority}</Cell>
                          <Cell singleLine>{status}</Cell>
                          <Cell singleLine>
                            <Tooltip content="Go to issue">
                              <a
                                href={`https://${hostname}/browse/${key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <CopyIcon size="medium" />
                              </a>
                            </Tooltip>
                          </Cell>
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
