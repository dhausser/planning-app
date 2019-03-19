import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import TeamFilter from '../components/TeamFilter';
import HolidayList from '../components/HolidayList';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

const ContentWrapper = styled.div`
  margin: ${gridSize() * 4}px ${gridSize() * 8}px;
  padding-bottom: ${gridSize() * 3}px;
`;

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