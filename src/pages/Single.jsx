import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import { Status } from '@atlaskit/status';
import { priorityIcon, statusColor } from '../components/IssueList';
import { NameWrapper } from '../components/ResourceList';
import InlineEdit, { SingleLineTextInput } from '@atlaskit/inline-edit';

export default class Single extends Component {
  state = {
    error: null,
    isLoaded: false,
    items: [],
    editValue: '',
    readValue: '',
    onEventResult: 'Click on a field above to show edit view',
  }

  static contextTypes = {
    isLoading: PropTypes.bool,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  componentDidUpdate = () => {
    (this.state.readValue === '') && this.setInitialState();
  }

  componentDidMount = () => {
    !this.context.isLoading && this.setInitialState();
  }

  setInitialState = () => {
    const { issueId } = this.props.params;
    const { issues } = this.context;
    const issue = issues.find(issue => issue.key === issueId);
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
    const { issueId } = this.props.params;
    const { issues, resources, isLoading } = this.context;
    const issue = issues.find(issue => issue.key === issueId);
    const resource = resources.find(resource => resource.key === issue.assignee);
    const id = 'inline-edit-single';

    return (
      <ContentWrapper>
        {!isLoading && issue
          && (
            <div style={{ padding: '0 16px' }}>
              <PageTitle>{this.state.readValue}</PageTitle>
              <a href={`https://jira.cdprojektred.com/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
              <p><Status text={issue.status} color={statusColor(issue)} /></p>
              <p>{priorityIcon(issue)} {issue.priority} {issue.issuetype}</p>
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
                  <Link to={`/profile/${resource.key}`}>{resource.name}</Link>
                </NameWrapper>
              </p>
            </div>
          )}
      </ContentWrapper>
    )
  }
}
