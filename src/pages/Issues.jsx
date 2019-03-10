import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import TeamFilter from '../components/TeamFilter';
import IssueList from '../components/IssueList';

export default class Issues extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  render() {
    const { issues, resources, isLoading  } = this.context;

    return (
      <ContentWrapper>
        <PageTitle>Issues</PageTitle>
        <TeamFilter />
        <IssueList issues={issues} resources={resources} isLoading={isLoading} />
      </ContentWrapper>
    )
  }
};