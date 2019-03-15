import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from './ContentWrapper';
import PageTitle from './PageTitle';
import TeamFilter from './TeamFilter';
import HolidayList from './HolidayList';

export default class Holidays extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    holidays: PropTypes.array,
    resources: PropTypes.array,
  };

  render() {
    const { holidays, resources, isLoading } = this.context;

    return (
      <ContentWrapper>
        <PageTitle>Absences</PageTitle>
        <TeamFilter />
        <HolidayList holidays={holidays} resources={resources} isLoading={isLoading} />
      </ContentWrapper>
    )
  }
};