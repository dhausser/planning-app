import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from './ContentWrapper';
import PageTitle from './PageTitle';
import TeamFilter from './TeamFilter';
import IssueList from './IssueList';

export default class Issues extends Component {
  state = {
    isLoading: true,
    issues: [],
  }

  static contextTypes = {
    filter: PropTypes.string,
    resources: PropTypes.array,
  };

  componentDidMount = async () => {
    const jql = 'filter=22119';
    const response = await fetch(`/api/search?jql=${jql}`);
    const issues = await response.json();
    this.setState({ issues, isLoading: false });
  }

  componentDidUpdate = () => {
    const { filter } = this.context;
    if (filter != null) {
      const team = this.context.resources
        .filter(({ team }) => team === filter)
        .map(({ key }) => key);
      const issues = this.state.issues
        .filter(({ assignee }) => team.includes(assignee));
      console.log(issues.length);

      // TODO Update the state without triggering infinite loop
      // this.setState({ issues });
    }
  }

  render() {
    return (
      <ContentWrapper>
        <PageTitle>Issues</PageTitle>
        <TeamFilter />
        <IssueList
          issues={this.state.issues}
          isLoading={this.state.isLoading}
          pathname={this.props.location.pathname}
        />
      </ContentWrapper>
    )
  }
};