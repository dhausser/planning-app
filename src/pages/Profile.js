import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import IssueList from '../components/IssueList';
import HolidayList from '../components/HolidayList';

export default class Profile extends Component {
  state = {
    isLoading: true,
    link: '',
    resource: {},
    issues: [],
  };

  static contextTypes = {
    isLoading: PropTypes.bool,
    resources: PropTypes.array,
  };

  componentDidMount = async () => {
    const { resourceId } = this.props.params;
    const jql = `project=GWENT AND fixVersion=2.0 AND assignee=${resourceId}`;
    const response = await fetch(`/api/search?jql=${jql}`);
    const issues = await response.json();

    // TODO Support edge case when resourse not found
    const { resources } = this.context;
    const resource = resources.find(({ key }) => key === resourceId);
    const link = `https://jira.cdprojektred.com/issues/?jql=assignee%20%3D%20${resource.key}%20AND%20statusCategory%20in%20(new%2C%20indeterminate)%20and%20fixVersion%20in%20earliestUnreleasedVersionByReleaseDate(GWENT)`;

    this.setState({ issues, resource, link, isLoading: false });
  }

  render() {
    return (
      <ContentWrapper>
        {!this.state.isLoading
          && (
            <div>
              <PageTitle>
                {this.state.resource.name}
                {' '}
                -
                {' '}
                {this.state.resource.team}
              </PageTitle>
              <a href={this.state.link} target="_blank" rel="noopener noreferrer">View in Issue Navigator</a>
              <IssueList issues={this.state.issues} isLoading={this.state.isLoading} />
              <HolidayList holidays={this.state.resource.holidays} isLoading={this.context.isLoading} />
            </div>
          )
        }
      </ContentWrapper>
    );
  }
};