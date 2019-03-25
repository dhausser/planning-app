import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import HolidayList from '../components/HolidayList';

export default class Holidays extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    filter: PropTypes.string,
    resources: PropTypes.array,
  };

  render() {
    const { resources, filter, isLoading } = this.context;
    const holidays = [];
    holidays.push = resources
      .filter(({ team }) => [null, team].includes(filter))
      .forEach(resource => holidays.push(...resource.holidays));

    return (
      <Padding>
        <PageTitle>Absences</PageTitle>
        <TeamFilter />
        <HolidayList
          holidays={holidays}
          resources={resources}
          isLoading={isLoading}
        />
      </Padding>
    );
  }
}
