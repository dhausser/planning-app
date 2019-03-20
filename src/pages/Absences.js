import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Padding } from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import HolidayList from '../components/HolidayList';

export default class Holidays extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    holidays: PropTypes.array,
    resources: PropTypes.array,
  };

  render() {
    const { holidays, resources, isLoading } = this.context;

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
