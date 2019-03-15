import React, { Component } from 'react';
import { Link } from 'react-router';
import { Status } from '@atlaskit/status';
import InlineEdit, { SingleLineTextInput } from '@atlaskit/inline-edit';
import ContentWrapper from './ContentWrapper';
import PageTitle from './PageTitle';
import { priorityIcon, statusColor } from './IssueList';
import { NameWrapper } from './ResourceList';

export default class Single extends Component {
  state = {
    error: null,
    isLoaded: false,
    issue: {},
    editValue: '',
    readValue: '',
    onEventResult: 'Click on a field above to show edit view',
  }

  componentDidUpdate = () => {
    (this.state.readValue === '') && this.setInitialState();
  }

  componentDidMount = async () => {
    const jql = `key=${this.props.params.issueId}`;
    const response = await fetch(`/api/search?jql=${jql}`);
    const issues = await response.json();
    this.setState({ issue: issues.shift(), isLoading: false });
    console.log(this.state.issue);
    this.setInitialState();
  }

  setInitialState = () => {
    const { issue } = this.state;
    this.setState({ readValue: issue.summary, editValue: issue.summary });
  }

  onConfirm = () => {
    console.log(`Sending value: ${this.state.editValue}`)

    this.setState({
      isLoaded: true,
      readValue: this.state.editValue,
    });

    fetch(`/api/edit?param=${this.state.editValue}`)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);

        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
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
    const { issue, isLoading } = this.state;
    console.log(issue.status);
    return (
      <ContentWrapper>
        {!isLoading
          && (
            <div style={{ padding: '0 16px' }}>
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
            </div>
          )}
      </ContentWrapper>
    )
  }
}
