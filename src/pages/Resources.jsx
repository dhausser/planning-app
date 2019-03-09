import React, { Component } from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import TeamFilter from '../components/TeamFilter';
import ResourceList from '../components/ResourceList';

export default class ResourcesPage extends Component {
  state = {
    filter: null,
  };

  updateFilter = (selected) => {
    const { filter } = this.state;
    this.setState({ filter: ((filter === selected) ? null : selected) })
  };

  render() {
    const { resources, isLoading } = this.props;
    const { filter } = this.state;

    return (
      <ContentWrapper>
        <PageTitle>Resources</PageTitle>
        <TeamFilter
          {...this.props}
          filter={filter}
          updateFilter={this.updateFilter} />
        {filter ? (
          <ResourceList resources={resources.filter(resource => resource.team === filter)} isLoading={isLoading} />
        ) : (
            <ResourceList resources={resources} isLoading={isLoading} />
          )}
      </ContentWrapper>
    );
  }
}
