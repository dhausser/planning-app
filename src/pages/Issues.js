import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import IssueList from '../components/IssueList';

export default class Issues extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    filter: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  static propTypes = {
    location: PropTypes.string,
  };

  componentDidUpdate = () => {
    const { filter, resources, issues } = this.context;
    if (filter != null) {
      const team = resources
        .filter(resource => resource.team === filter)
        .map(({ key }) => key);
      const teamIssues = issues.filter(({ assignee }) =>
        team.includes(assignee)
      );
      console.log(teamIssues.length);

      // TODO Update the state without triggering infinite loop
      // this.setState({ issues: teamIssues });
    }
  };

  render() {
    const { location } = this.props;
    const { pathname } = location;
    const { issues, isLoading } = this.context;
    return (
      <Padding>
        <PageTitle>Issues</PageTitle>
        <TeamFilter />
        <IssueList issues={issues} isLoading={isLoading} pathname={pathname} />
      </Padding>
    );
  }
}
