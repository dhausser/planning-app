import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Filters from '../components/Filters';
import HolidayList from '../components/HolidayList';

export default class Holidays extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    team: PropTypes.string,
    resources: PropTypes.array,
  };

  render() {
    const { resources, team, isLoading } = this.context;
    const holidays = [];
    holidays.push = resources
      .filter(resource => (team ? resource.team === team : true))
      .forEach(resource => holidays.push(...resource.holidays));

    return (
      <ContentWrapper>
        <PageTitle>Absences</PageTitle>
        <Filters />
        <HolidayList
          holidays={holidays}
          resources={resources}
          isLoading={isLoading}
        />
      </ContentWrapper>
    );
  }
}
