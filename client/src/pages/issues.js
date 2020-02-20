import React, { useState, useEffect } from "react"

import { gql, useQuery } from "@apollo/client"

import PropTypes from "prop-types"

import { withNavigationViewController } from "@atlaskit/navigation-next"
import PageHeader from "@atlaskit/page-header"
import TextField from "@atlaskit/textfield"

import {
  productIssuesView,
  Layout,
  ProjectFilter,
  VersionFilter,
  StatusFilter,
  TeamFilter,
  IssueTable,
  LoadButton,
} from "../components"

const ROWS_PER_PAGE = 50

export const ISSUE_ROW_DATA = gql`
  fragment IssueRow on Issue {
    id
    key
    fields {
      summary
      issuetype {
        id
        name
      }
      priority {
        id
        name
      }
      status {
        name
        statusCategory {
          id
        }
      }
      fixVersions {
        id
        name
      }
      assignee {
        key
        displayName
      }
    }
  }
`

export const ISSUE_PAGINATION = gql`
  fragment IssuePagination on IssueConnection {
    startAt
    maxResults
    total
  }
`

const GET_ISSUES = gql`
  query GetIssues(
    $projectId: String
    $versionId: String
    $statusId: String
    $teamId: String
    $resourceId: String
    $startAt: Int
    $maxResults: Int
  ) {
    projectId @client @export(as: "projectId")
    versionId @client @export(as: "versionId")
    statusId @client @export(as: "statusId")
    teamId @client @export(as: "teamId")
    issues(
      projectId: $projectId
      versionId: $versionId
      statusId: $statusId
      teamId: $teamId
      resourceId: $resourceId
      startAt: $startAt
      maxResults: $maxResults
    ) {
      ...IssuePagination
      issues {
        ...IssueRow
      }
    }
  }
  ${ISSUE_PAGINATION}
  ${ISSUE_ROW_DATA}
`

const barContent = (
  <div style={{ display: "flex" }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <ProjectFilter />
    <VersionFilter />
    <StatusFilter />
    <TeamFilter />
  </div>
)

function Issues({ navigationViewController }) {
  const [length, setLength] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(GET_ISSUES, {
    variables: { maxResults: ROWS_PER_PAGE },
  })

  useEffect(() => {
    if (data && data.issues && data.issues.issues.length) {
      setLength(data.issues.issues.length)
    }
    navigationViewController.setView(productIssuesView.id)
  }, [navigationViewController, data])

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Search Issues</PageHeader>
      <IssueTable
        loading={loading}
        error={error}
        issues={data && data.issues}
        rowsPerPage={ROWS_PER_PAGE + length}
        startAt={length}
      />
      {data && data.issues && data.issues.total > length && (
        <LoadButton fetchMore={fetchMore} startAt={length} />
      )}
    </Layout>
  )
}

Issues.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
}

export default withNavigationViewController(Issues)
