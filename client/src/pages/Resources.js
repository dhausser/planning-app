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
    team: PropTypes.string,
  };

  render() {
    const { isLoading, team } = this.context;
    const resources = team
      ? this.context.resources.team(resource => resource.team === team)
      : this.context.resources;
    console.log({ resources });
    return (
      <Padding>
        <PageTitle>People</PageTitle>
        <TeamFilter />
        <ResourceList resources={resources} isLoading={isLoading} />
      </Padding>
    );
  }
}
