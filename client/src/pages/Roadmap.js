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
import { projectId } from '../credentials'

export default function Roadmap() {
  const { fixVersion } = useContext(FilterContext)
  const epics = useIssues(
    `project = ${projectId} AND fixVersion = ${
      fixVersion.id
    } AND issuetype = epic`
  )
  const epicChildren = useIssues(
    `project=${projectId} AND fixVersion = ${
      fixVersion.id
    } AND 'Epic Link' in (10013)`
    // ${epics.issues.map(({ id }) => id)}
  )
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
    key: issue.key,
    summary: issue.summary,
    value: getIcon[issue.priority],
    status: (
      <Status text={issue.status.name} color={getIcon[issue.status.category]} />
    ),
    children:
      issue.children &&
      issue.children.map(child => ({
        type: getIcon[child.type],
        key: child.key,
        summary: child.summary,
        value: getIcon[child.priority],
        status: (
          <Status
            text={child.status.name}
            color={getIcon[child.status.category]}
          />
        ),
        children: [],
        //   child.fields.subtasks.map(subtask => ({
        //   type: getIcon[subtask.fields.issuetype.name],
        //   key: subtask.key,
        //   summary: subtask.fields.summary,
        //   value: getIcon[subtask.fields.priority.name],
        //   status: (
        //     <Status
        //       text={subtask.fields.status.name}
        //       color={getIcon[subtask.fields.status.statusCategory.key]}
        //     />
        //   ),
        //   children: [],
        // })),
      })),
  }))
}
