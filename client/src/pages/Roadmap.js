import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree'
import Spinner from '@atlaskit/spinner'
import { Status } from '@atlaskit/status'
import ContentWrapper, { Center } from '../components/ContentWrapper'
import PageTitle from '../components/PageTitle'
import { getIcon } from '../components/Icon'
import Filters from '../components/Filters'
import { FilterContext } from '../context/FilterContext'
import { useIssues } from './Issues'
import { projectId, epicIds } from '../credentials'

export default function Roadmap() {
  const { fixVersion } = useContext(FilterContext)

  let jql = `project = ${projectId} AND fixVersion = ${
    fixVersion.id
  } AND issuetype = epic`
  const epicQuery = `{
    issues(jql: "${jql}", pageSize: 10, after: 0) {
      startAt
      maxResults
      total
      issues {
        summary
        type
        priority
        status {
          name
          category
        }
      }
    }
  }`

  jql = `project=${projectId} AND fixVersion = ${
    fixVersion.id
  } AND 'Epic Link' in (${epicIds})`
  const childrenQuery = `{
    issues(jql: "${jql}", pageSize: 10, after: 0) {
      startAt
      maxResults
      total
      issues {
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
  }`

  const epics = useIssues(epicQuery)
  const epicChildren = useIssues(childrenQuery)
  if (epics.issues.length) {
    epics.issues[0].children = epicChildren.issues
  }

  return (
    <ContentWrapper>
      <PageTitle>Roadmap</PageTitle>
      <Filters />
      {epics.isLoading ? (
        <Center>
          <Spinner size="large" />
        </Center>
      ) : (
        <TableTree>
          <Headers>
            <Header width={150}>Type</Header>
            <Header width={800}>Summary</Header>
            <Header width={100}>Value</Header>
            <Header width={200}>Status</Header>
          </Headers>
          <Rows
            items={convertIssues(epics.issues)}
            render={({ type, key, summary, value, status, children }) => (
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
      )}
    </ContentWrapper>
  )
}

function convertIssues(issues) {
  return issues.map(issue => ({
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
