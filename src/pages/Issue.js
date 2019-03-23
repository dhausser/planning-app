import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Status } from '@atlaskit/status';
import InlineEdit, { SingleLineTextInput } from '@atlaskit/inline-edit';
import Avatar from '@atlaskit/avatar';
import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  // CommentLayout,
  CommentTime,
} from '@atlaskit/comment';
import TextArea from '@atlaskit/textarea';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import { priorityIcon, statusColor } from '../components/IssueList';
import { NameWrapper, AvatarWrapper } from '../components/ResourceList';

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
  }).then(response => response.json());
}

export default class Issue extends Component {
  state = {
    isLoading: true,
    issue: {},
    comments: [],
    editValue: '',
    readValue: '',
  };

  static propTypes = {
    params: PropTypes.object,
  };

  componentDidMount = async () => {
    const { issueId } = this.props.params;
    const response = await fetch(`/api/issue?key=${issueId}`);
    const { issue, comments } = await response.json();

    this.setState({
      isLoading: false,
      issue,
      comments,
      readValue: issue.summary,
      editValue: issue.summary,
    });
  };

  onConfirm = () => {
    const { readValue, editValue } = this.state;
    this.setState({ readValue: editValue });
    postData('/api/issue', {
      key: this.state.issue.key,
      summary: this.state.editValue,
    })
      .then(data => {
        switch (data) {
          case 400:
            console.log(
              'STATUS 400: Returned if the requested issue update failed.'
            );
            this.setState({ readValue });
            break;
          case 204:
            console.log(
              'STATUS 204: Returned if it updated the issue successfully.'
            );
            break;
          case 403:
            console.log(
              'STATUS 403: Returned if the user doesnt have permissions to disable users notification.'
            );
            this.setState({ readValue });
            break;

          default:
            break;
        }
      })
      .catch(error => console.error(error));
  };

  onCancel = () => {
    this.setState(state => ({ editValue: state.readValue }));
  };

  onChange = event => {
    this.setState({
      editValue: event.target.value,
    });
  };

  renderInput = ({ isEditing, id }) => (
    <SingleLineTextInput
      id={id}
      isEditing={isEditing}
      isInitiallySelected
      value={this.state.editValue}
      onChange={this.onChange}
    />
  );

  render() {
    const id = 'inline-edit-single';
    const { issue, comments, isLoading } = this.state;

    if (isLoading) return <p>Loading...</p>;
    return (
      <Padding>
        <PageTitle>{this.state.readValue}</PageTitle>
        <a
          href={`https://jira.cdprojektred.com/browse/${issue.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View in Issue Navigator
        </a>
        <h5>Assignee</h5>
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={issue.displayName}
              size="large"
              src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${encodeURIComponent(
                issue.assignee
              )}`}
            />
          </AvatarWrapper>
          <Link to={`/resource/${issue.assignee}`}>{issue.displayName}</Link>
        </NameWrapper>
        <h5>Status</h5>
        <Status
          text={issue.status || ''}
          color={statusColor(issue.statusCategory)}
        />
        <h5>FixVersion</h5>
        {issue.fixVersion}
        <h5>Priotity</h5>
        {priorityIcon(issue.priority)} {issue.priority} {issue.issuetype}
        <InlineEdit
          isFitContainerWidthReadView
          label="Summary"
          labelHtmlFor={id}
          editView={this.renderInput({ isEditing: true, id })}
          readView={this.renderInput({ isEditing: false, id })}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          {...this.props}
        />
        <h5>Description</h5>
        <TextArea value={issue.description} resize="smart" />
        <h5>Comments</h5>
        {comments.map(comment => (
          <Comment
            key={comment.id}
            avatar={
              <Avatar
                src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${encodeURIComponent(
                  comment.author.key
                )}`}
                label="Atlaskit avatar"
                size="medium"
              />
            }
            author={<CommentAuthor>{comment.author.displayName}</CommentAuthor>}
            // type="author"
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
        <TextArea />
      </Padding>
    );
  }
}
