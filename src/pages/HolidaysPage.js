import React from 'react';
import HolidayList from '../components/HolidayList';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';

export default (props) => (
  <ContentWrapper>
    <PageTitle>Absences</PageTitle>
    <HolidayList {...props}/>
  </ContentWrapper>
)