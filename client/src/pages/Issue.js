import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Spinner from '@atlaskit/spinner';
import { Status } from '@atlaskit/status';
import InlineEdit, { SingleLineTextInput } from '@atlaskit/inline-edit';
import Avatar from '@atlaskit/avatar';
import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from '@atlaskit/comment';

import ContentWrapper, {
  NameWrapper,
  AvatarWrapper,
  Center,
} from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import { getIcon } from '../modules/Helpers';

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
      readValue: issue.fields.summary,
      editValue: issue.fields.summary,
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

    if (isLoading)
      return (
        <Center>
          <Spinner size="large" />
        </Center>
      );
    return (
      <ContentWrapper>
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
              name={issue.fields.assignee.displayName}
              size="large"
              src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${
                issue.fields.assignee.key
              }`}
            />
          </AvatarWrapper>
          <Link to={`/resource/${issue.fields.assignee.key}`}>
            {issue.fields.assignee.displayName}
          </Link>
        </NameWrapper>
        <h5>Status</h5>
        <Status
          text={issue.fields.status.name}
          color={getIcon[issue.fields.status.statusCategory.key]}
        />
        <h5>FixVersion</h5>
        {issue.fields.fixVersions[0] && issue.fields.fixVersions[0].name}
        <h5>Type</h5>
        {getIcon[issue.fields.issuetype.name]}
        <h5>Priotity</h5>
        {getIcon[issue.fields.priority.name]}
        <InlineEdit
          isFitContainerWidthReadView
          label="Summary"
          labelHtmlFor="inline-single-edit"
          editView={this.renderInput({ isEditing: true, id })}
          readView={this.renderInput({ isEditing: false, id })}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          {...this.props}
        />
        <InlineEdit
          isFitContainerWidthReadView
          label="Description"
          labelHtmlFor="inline-single-edit"
          editView={issue.fields.description}
          readView={issue.fields.description}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          {...this.props}
        />
        {comments.map(comment => (
          <Comment
            key={comment.id}
            avatar={
              <Avatar
                src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${
                  comment.author.key
                }`}
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
        <InlineEdit
          isFitContainerWidthReadView
          label="Comment"
          labelHtmlFor="inline-single-edit"
          editView="Comment here"
          readView="Comment here"
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          {...this.props}
        />
      </ContentWrapper>
    );
  }
}
