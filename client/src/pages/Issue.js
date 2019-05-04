import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import gql from 'graphql-tag'
import { Status } from '@atlaskit/status'
import InlineEdit, { SingleLineTextInput } from '@atlaskit/inline-edit'
import Avatar from '@atlaskit/avatar'
import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from '@atlaskit/comment'
import { productIssuesView } from '../components/Nav'
import { Page, Loading, Error } from '../components'
import { NameWrapper, AvatarWrapper } from '../components/Page'
import { getIcon } from '../components/Icon'
import { hostname } from '../credentials'

const GET_ISSUE = gql`
  query GetIssueById($id: ID!) {
    issue(id: $id) {
      id
      key
      summary
      priority
      status {
        name
        category
      }
      fixVersions {
        name
      }
      assignee {
        key
        name
      }
      comments {
        id
        author {
          key
          name
        }
        body
        created
        updated
      }
    }
  }
`

function Issue({ navigationViewController, match }) {
  useEffect(() => {
    navigationViewController.setView(productIssuesView.id)
  }, [navigationViewController])

  const {
    data: { issue },
    loading,
    error,
  } = useQuery(GET_ISSUE, {
    variables: { id: match.params.issueId },
  })

  if (loading) return <Loading />
  if (error) return <Error error={error} />
  return (
    <Page title={issue.summary}>
      <a
        href={`https://${hostname}/browse/${issue.key}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
      <h5>Assignee</h5>
      {issue.assignee ? (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={issue.assignee.name}
              size="large"
              src={`https://${hostname}/secure/useravatar?ownerId=${
                issue.assignee.key
              }`}
            />
          </AvatarWrapper>
          <Link to={`/resource/${issue.assignee.key}`}>
            {issue.assignee.name}
          </Link>
        </NameWrapper>
      ) : (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar name="Unassigned" size="large" />
          </AvatarWrapper>
          Unassigned
        </NameWrapper>
      )}
      <h5>Status</h5>
      <Status text={issue.status.name} color={getIcon[issue.status.category]} />
      <h5>FixVersion</h5>
      {issue.fixVersions[0] && issue.fixVersions[0].name}
      <h5>Type</h5>
      {getIcon[issue.type]}
      <h5>Priotity</h5>
      {getIcon[issue.priority]}
      <InlineEdit
        isFitContainerWidthReadView
        label="Summary"
        labelHtmlFor="inline-single-edit"
        editView={renderInput({
          isEditing: true,
          id: 'inline-edit-single',
        })}
        readView={renderInput({
          isEditing: false,
          id: 'inline-edit-single',
        })}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
      <InlineEdit
        isFitContainerWidthReadView
        label="Description"
        labelHtmlFor="inline-single-edit"
        editView={issue.description}
        readView={issue.description}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
      {issue.comments.map(comment => (
        <Comment
          key={comment.id}
          avatar={
            <Avatar
              src={`https://${hostname}/secure/useravatar?ownerId=${
                comment.author.key
              }`}
              label="Atlaskit avatar"
              size="medium"
            />
          }
          author={<CommentAuthor>{comment.author.name}</CommentAuthor>}
          edited={comment.updated && <CommentEdited>Edited</CommentEdited>}
          time={
            <CommentTime>
              {new Date(comment.created).toLocaleDateString()}
            </CommentTime>
          }
          content={<p>{comment.body}</p>}
          actions={[
            <CommentAction>Reply</CommentAction>,
            <CommentAction>Edit</CommentAction>,
            <CommentAction>Like</CommentAction>,
          ]}
        />
      ))}
      <InlineEdit
        isFitContainerWidthReadView
        label="Comment"
        labelHtmlFor="inline-single-edit"
        editView="Comment here"
        readView="Comment here"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Page>
  )
}

function onConfirm() {
  const { readValue, editValue } = this.state
  this.setState({ readValue: editValue })
  postData('/api/issue', {
    key: this.state.issue.key,
    summary: this.state.editValue,
  })
    .then(data => {
      switch (data) {
        case 400:
          console.log(
            'STATUS 400: Returned if the requested issue update failed.',
          )
          this.setState({ readValue })
          break
        case 204:
          console.log(
            'STATUS 204: Returned if it updated the issue successfully.',
          )
          break
        case 403:
          console.log(
            'STATUS 403: Returned if the user doesnt have permissions to disable users notification.',
          )
          this.setState({ readValue })
          break
        default:
          break
      }
    })
    .catch(error => console.error(error))
}

function onCancel() {
  this.setState(state => ({ editValue: state.readValue }))
}

function onChange(event) {
  this.setState({
    editValue: event.target.value,
  })
}

function renderInput({ editValue, isEditing, id }) {
  return (
    <SingleLineTextInput
      id={id}
      isEditing={isEditing}
      isInitiallySelected
      value={editValue}
      onChange={onChange}
    />
  )
}
function postData(url = ``, data = {}) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data),
  }).then(response => response.json())
}
export default withNavigationViewController(Issue)

// componentDidMount = async () => {
//   const { issueId } = this.props.match.params;
//   const response = await fetch(`/api/issue?key=${issueId}`);
//   const { issue, comments } = await response.json();

//   let defautlValue = '';
//   if (issue.fields) defautlValue = issue.fields.summary;

//   this.setState({
//     isLoading: false,
//     issue,
//     comments,
//     readValue: defautlValue,
//     editValue: defautlValue,
//     name: 'jira.cdprojektred.com',
//   });
// };
