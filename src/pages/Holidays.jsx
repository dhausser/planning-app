import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HolidayList from '../components/HolidayList';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';

export default class Holidays extends Component {
  static contextTypes = {
    isLoading: PropTypes.bool,
    holidays: PropTypes.array,
    resources: PropTypes.array,
  };

  render() {
    const { holidays, resources, isLoading  } = this.context;
    return (
      <ContentWrapper>
        <PageTitle>Absences</PageTitle>
        <HolidayList holidays={holidays} resources={resources} isLoading={isLoading} />
      </ContentWrapper>
    )
  }
};