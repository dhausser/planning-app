import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Padding } from '../components/ContentWrapper';
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
      <Padding>
        <PageTitle>People</PageTitle>
        <TeamFilter />
        <ResourceList resources={resources} isLoading={isLoading} />
      </Padding>
    );
  }
}
