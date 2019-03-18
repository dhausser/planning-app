import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import ResourceList from '../components/ResourceList';

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
