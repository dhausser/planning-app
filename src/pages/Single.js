import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Status } from '@atlaskit/status';
import InlineEdit, { SingleLineTextInput } from '@atlaskit/inline-edit';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import { priorityIcon, statusColor } from '../components/IssueList';
import { NameWrapper } from '../components/ResourceList';

function postData(url = ``, data = {}) {
  return fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(data),
  })
    .then(response => response.json());
}

export default class Single extends Component {
  state = {
    issue: {},
    error: null,
    editValue: '',
    readValue: '',
    onEventResult: 'Click on a field above to show edit view',
  }

  static contextTypes = {
    isLoading: PropTypes.bool,
    issues: PropTypes.array,
  };

  componentDidMount = async () => {
    const issue = this.getIssue();
    if (issue != null) {
      this.setState({ issue, readValue: issue.summary, editValue: issue.summary });
    }
  }

  componentDidUpdate = () => {
    if (this.state.readValue === '') {
      const issue = this.getIssue()
      this.setState({ issue, readValue: issue.summary, editValue: issue.summary });
    }
  }

  getIssue() {
    const { issueId } = this.props.params;
    const { isLoading, issues } = this.context;
    if (!isLoading) {
      console.log(issueId);
      const issue = issues.find(({ key }) => key === issueId);
      return issue;
    } else {
      return null;
    }
  }

  onConfirm = () => {
    const { readValue } = this.state;
    this.setState({ readValue: this.state.editValue });
    postData('/api/issue', { key: this.state.issue.key, summary: this.state.editValue })
      .then(data => {
        switch (data) {
        case 400:
          console.log('STATUS 400: Returned if the requested issue update failed.');
          this.setState({ readValue });
          break;
        case 204:
          console.log('STATUS 204: Returned if it updated the issue successfully.');
          break;
        case 403:
          console.log('STATUS 403: Returned if the user doesnt have permissions to disable users notification.');
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

  onChange = (event) => {
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
    const { isLoading } = this.context;
    const { issue } = this.state;

    return (
      // <div style={{ padding: '0 16px' }}>
      //   {!isLoading &&
      <ContentWrapper>
        <PageTitle>{this.state.readValue}</PageTitle>
        <a href={`https://jira.cdprojektred.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
        <p><Status text={issue.status || ''} color={statusColor(issue.statusCategory)} /></p>
        <p>{priorityIcon(issue.priority)} {issue.priority} {issue.issuetype}</p>
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
        <p>
          <NameWrapper>
            <Link to={`/profile/${issue.assignee}`}>{issue.displayName}</Link>
          </NameWrapper>
        </p>
      </ContentWrapper>
      //   }
      // </div>
    )
  }
}
