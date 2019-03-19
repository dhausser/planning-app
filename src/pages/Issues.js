import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import IssueList from '../components/IssueList';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

const ContentWrapper = styled.div`
  margin: ${gridSize() * 4}px ${gridSize() * 8}px;
  padding-bottom: ${gridSize() * 3}px;
`;

export default class Issues extends Component {
  state = {
    issues: [],
  }

  static contextTypes = {
    filter: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  componentDidUpdate = () => {
    const { filter, resources, issues } = this.context;
    if (filter != null) {
      const team = resources
        .filter(({ team }) => team === filter)
        .map(({ key }) => key);
      const teamIssues = issues
        .filter(({ assignee }) => team.includes(assignee));
      console.log(teamIssues.length);

      // TODO Update the state without triggering infinite loop
      // this.setState({ issues: teamIssues });
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