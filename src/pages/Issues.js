import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import IssueList from '../components/IssueList';

const reducer = (acc, val) => [...acc, ...val.issues];

export default class Issues extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    filter: PropTypes.string,
    issues: PropTypes.array,
    resources: PropTypes.array,
  };

  static propTypes = {
    location: PropTypes.object,
  };

  render() {
    const { resources, filter, isLoading } = this.context;
    const issues = filter
      ? resources.filter(({ team }) => team === filter).reduce(reducer, [])
      : resources.reduce(reducer, []);
    return (
      <Padding>
        <PageTitle>Issues</PageTitle>
        <TeamFilter />
        <IssueList
          issues={issues}
          isLoading={isLoading}
          pathname={this.props.location.pathname}
        />
      </Padding>
    );
  }
}
