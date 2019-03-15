import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from './ContentWrapper';
import PageTitle from './PageTitle';
import TeamFilter from './TeamFilter';
import ResourceList from './ResourceList';

export default class ResourcesPage extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    resources: PropTypes.array,
    filter: PropTypes.string,
  };

  render() {
    const { isLoading, filter } = this.context;
    const resources = filter ? (
      this.context.resources.filter(({ team }) => team === filter)
    ) : (
      this.context.resources
    );

    return (
      <ContentWrapper>
        <PageTitle>Resources</PageTitle>
        <TeamFilter />
        <ResourceList resources={resources} isLoading={isLoading} />
      </ContentWrapper>
    );
  }
}
