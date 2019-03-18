import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import IssueList from '../components/IssueList';

export default class Issues extends Component {
  static contextTypes = {
    filter: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  componentDidUpdate = () => {
    const { filter, resources } = this.context;
    if (filter != null) {
      const team = resources
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
    const { issues, isLoading } = this.context;
    return (
      <ContentWrapper>
        <PageTitle>Issues</PageTitle>
        <TeamFilter />
        <IssueList
          issues={issues}
          isLoading={isLoading}
          pathname={this.props.location.pathname}
        />
      </ContentWrapper>
    )
  }
};